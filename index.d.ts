

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
  // ProjectId?: string;
  // TopicId?: string;
  // Source?: string;
  // CompressType?: CompressType;
  // Log: Record<string, string>;
  [index:string]: string;
}

// export interface MultiLogsReq {
//   ProjectId?: string;
//   TopicId?: string;
//   Source?: string;
//   Logs: Record<string, any>[];
//   CompressType?: CompressType;
// }

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
  sendLog: (data: SingleLogReq) => Promise<any>;
  sendBatchLogs: (data: MultiLogsReq, options?: AsyncBatchLogsConfigOptions) => void;
  sendBatchLogsImmediate: (data: MultiLogsReq) => Promise<any>;
}
