import {
  AsyncBatchLogsConfigOptions,
  MultiLogsReq,
  SingleLogReq,
  WebTrackerOptions,
  CompressType,
} from '../../index';
import lz4 from '../lib/lz4';

type Method = 'get' | 'post';

type Buffer = typeof lz4.Buffer;

interface RequestOptions {
  url: string;
  method: Method;
  params?: Record<string, any>;
  body?: Record<string, any> | Buffer;
}

/**
 * @copyright Copyright (2022) Volcengine
 * @licence MIT
 */
class WebTracker {
  host: string;
  protocol: string;
  time: number;
  count: number;
  headers: Record<string, any>;
  timer: number;
  logs: Record<string, any>[];
  projectId: string;
  topicId: string;
  source: string;
  compressType: CompressType;

  constructor(opt: WebTrackerOptions) {
    this.host = opt.host;
    this.protocol = opt.protocol ?? 'https';
    this.time = this.correctTimeAndCount(opt.time);
    this.count = this.correctTimeAndCount(opt.count);
    this.timer = -1;
    this.projectId = opt.projectId;
    this.topicId = opt.topicId;
    this.source = opt.source ?? '';
    this.logs = [];
    this.headers = opt.headers ?? {};
    this.compressType = 'lz4';
  }

  correctTimeAndCount = (num: any) => {
    if (typeof num !== 'number') return 10;
    if (num < 1 || num > 20) {
      return 10
    }
    return num;
  }

  objToQuery = (obj?: Record<string, any>) => {
    if (!obj || typeof obj !== 'object') return '';
    return Object.keys(obj).reduce((pre, cur) => {
      const v = obj[cur];
      if (v === undefined || v === null) {
        return pre;
      }
      if (pre) {
        return`${pre}&${cur}=${encodeURIComponent(v)}`
      }

      return `${cur}=${encodeURIComponent(v)}`;

    }, '');
  }

  handleQuery = (url: string, params?: Record<string, any>) => {
    if (!params) return url;
    const query = this.objToQuery(params);
    if (url.indexOf('?') !== -1) {
      const lastStr = url.substring(url.length - 1);
      if (lastStr === '&') {
        return `${url}${query}`
      }
      return `${url}&${query}`;
    }
    return query ? `${url}?${query}` : url;
  }

  jsonStringify = (obj: Record<string, any>) => {
    try {
      return JSON.stringify(obj);
    } catch (err) {
      return `${obj}`
    }
  }

  handleRequestOptions = (options: RequestOptions) => {
    const { url, method, params } = options;
    let body: any = this.jsonStringify(options.body);
    const originBodyLength = body?.length;
    let lz4CompressError = false;
    try {
      body = this.lz4Compress(body);
    } catch (e) {
      lz4CompressError = true;
    }
    const headers: Record<string, any> = {
      ...this.headers,
    };
    if(lz4CompressError) {
      headers['content-type'] = 'application/json';
    }
    if (!lz4CompressError) {
      headers['x-tls-bodyrawsize'] = `${originBodyLength}`;
      headers['x-tls-compresstype'] = this.compressType;
    }
    const resource = this.handleQuery(url, params);
    return {
      url: resource,
      body,
      headers,
      method,
    }
  }

  requestByFetch = (options: RequestOptions) => {
    const result = this.handleRequestOptions(options);
    return fetch(result.url, {
      method: result.method,
      headers: result.headers,
      mode: 'cors',
      cache: 'no-store',
      body: result.body,
      keepalive: true,
    }).then((response) => {
      let res: Record<string, any> | string = '';
      try {
        res = response.json();
      } catch (err) {
        res = response.text();
      }
      if (response.status !== 200) {
        throw new Error(`Status: ${response.status}, Error: ${res}`);
      }
      return res;
    })
  }

  requestByXHR = (options: RequestOptions) => {
    const result = this.handleRequestOptions(options);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(result.method, result.url, true);
      xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            resolve('');
            return;
          }
          let errObj = xhr.response;
          try {
            errObj = JSON.parse(errObj);
          } catch (e) {
          } finally {
            reject(errObj);
          }
        }
      }

      for (let k in result.headers) {
        xhr.setRequestHeader(k, result.headers[k]);
      }
      xhr.send(result.body);
    })
  }

  request = (options: RequestOptions) => {
    const browserSupportsKeepalive = 'Request' in window && 'keepalive' in new Request('');
    if (browserSupportsKeepalive) {
      return this.requestByFetch(options);
    }
    return this.requestByXHR(options);
  }

  genNewData = () => ({
    Source: this.source,
    TopicId: this.topicId,
    ProjectId: this.projectId,
  })

  lz4Compress = (input: string) => {
    const innerInput = lz4.Buffer.from(input);
    let output = lz4.Buffer.alloc(lz4.LZ4.encodeBound(innerInput.length));
    const compressedSize = lz4.LZ4.encodeBlock(innerInput, output);
    output = output.slice(0, compressedSize);
    if (!compressedSize) throw new Error('no need to compress');
    return output;
  }

  transformObjValueToString = (obj: Record<string, any>) => {
    const newObj: Record<string, string> = {};
    for (const i in obj) {
      const v = obj[i];
      if (typeof v !== 'string') {
        newObj[i] = this.jsonStringify(v);
      } else {
        newObj[i] = v;
      }
    }
    return newObj;
  }

  sendBatchLogsImmediateInner = () => {
    clearTimeout(this.timer);
    this.timer = -1;
    const Logs = this.logs;
    this.logs = [];
    return this.request({
      url: `${this.protocol}://${this.host}/WebTracks`,
      params: {
        ProjectId: this.projectId,
        TopicId: this.topicId,
      },
      body: {
        Logs,
        Source: this.source,
      },
      method: 'post',
    });
  }

  sendBatchLogsInner = (options?: AsyncBatchLogsConfigOptions) => {
    const { onSuccess, onFail } = options || {};
    if (this.logs.length >= this.count) {
      const Logs = this.logs;
      this.sendBatchLogsImmediateInner().then(() => {
        if (onSuccess) {
          onSuccess(Logs);
        }
      }).catch((err) => {
        if (onFail) {
          onFail(Logs, err);
        }
      });
    } else if (this.timer < 0) {
      this.timer = window.setTimeout(() => {
        const Logs = this.logs;
        this.sendBatchLogsImmediateInner().then(() => {
          if (onSuccess) {
            onSuccess(Logs)
          }
        }).catch((err) => {
          if (onFail) {
            onFail(Logs, err);
          }
        });
      }, this.time * 1000);
    }
  }

  pushLogs = (data: MultiLogsReq) => {
    const newData = (data || []).map((d) => {
      return this.transformObjValueToString(d);
    });
    this.logs.push(...newData);
  }


  send = (data: SingleLogReq, options?: AsyncBatchLogsConfigOptions) => {
    this.sendBatchLogs([data], options);
  }

  sendImmediate = (data: SingleLogReq) => {
    return this.sendBatchLogsImmediate([data]);
  }

  sendBatchLogs = (data: MultiLogsReq, options?: AsyncBatchLogsConfigOptions) => {
    this.pushLogs(data);
    return this.sendBatchLogsInner(options || {});
  }

  sendBatchLogsImmediate = (data: MultiLogsReq) => {
    this.pushLogs(data);
    return this.sendBatchLogsImmediateInner();
  }
}

export default WebTracker;
