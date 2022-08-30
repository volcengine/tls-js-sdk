

export type CompressType = 'lz4';
export interface WebTrackerOptions {
  host: string; // 不带协议
  projectId: string;
  topicId: string;
  source?: string;
  protocol?: string; // https | http
  time?: number;
  count?: number;
  headers?: Record<string, any>;
}

export interface SingleLogReq {

  [index:string]: any;
}

export type MultiLogsReq = Record<string, any>[]

export interface OnCallback {
  (logs: Record<string, any>[], err?: any): void;
}

interface AsyncBatchLogsConfigOptions{
  onSuccess?: OnCallback;
  onFail?: OnCallback;
}

export interface WebTrackBrowserOptions extends WebTrackerOptions {
}

export class WebTrackerBrowser {
  constructor(options: WebTrackBrowserOptions);
  send: (data: SingleLogReq) => Promise<any>;
  sendImmediate: (data: SingleLogReq) => void;
  sendBatchLogs: (data: MultiLogsReq, options?: AsyncBatchLogsConfigOptions) => void;
  sendBatchLogsImmediate: (data: MultiLogsReq) => Promise<any>;
}
