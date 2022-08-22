import { WebTrackBrowserOptions } from '../../index';
import WebTracker from './WebTracker';

/**
 * @copyright Copyright (2022) Volcengine
 * @licence MIT
 */
class WebTrackerBrowser extends WebTracker {
  constructor(opt: WebTrackBrowserOptions) {
    super(opt);
    window.addEventListener('beforeunload', () => {

      this.sendBatchLogsImmediateInner();
    });
  }
}

export default WebTrackerBrowser;
