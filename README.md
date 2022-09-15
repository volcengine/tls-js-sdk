# TLS JS SDK 
[中文文档](https://github.com/volcengine/tls-js-sdk/blob/master/README.zh_CN.md)

This is TLS JS SDK for browser.
> TLS is short for Tinder Log Service.

# Installation

```shell
npm install -S @volcengine/tls-js-sdk
```

# Basic Usage

Import in the module file
```typescript
import { WebTrackerBrowser } from '@volcengine/tls-js-sdk';

const wtb = new WebTrackerBrowser({
  host: 'your host',
  projectId: 'your projectId',
  topicId: 'your topicId',
});

```

Import directly in the browser
```html
<html>
<head></head>
<body>
<script src="path/to/tls-js-sdk/dist/tls_browser.js"></script>
<script>
    const wtb = new TLS_Browser.WebTrackerBrowser({
        host: 'your host',
        projectId: 'your projectId',
        topicId: 'your topicId',
    });
</script>
</body>
</html>

```

# API
## WebTrackerBrowser
Class for web tracker in browser

```typescript
import { WebTrackerBrowser } from '@volcengine/tls-js-sdk';

const wtb = new WebTrackerBrowser({
  host: 'your host', // required
  projectId: 'your projectId', // required
  topicId: 'yourt topicId', // required
  protocol: 'your protocol', // optional.The default value is https
  time: 'batch log time interval', // optional.The default value is 10s.
  count: 'batch log limit', // optional.The default value is 10.
  source: 'log source', // optional.
});
```

WebTrackerBrowser instance method below.

### send

send(data)

| params  | description                                                                    |
|:--------|:-------------------------------------------------------------------------------|
| data    | (required) like { [index: string]: any } |

```typescript
wtb.send({
  key: 'value', // custom key/value
});
```

### sendImmediate

sendImmediate(data)

| params  | description                                                                    |
|:--------|:-------------------------------------------------------------------------------|
| data    | (required) like { [index: string]: any } |

```typescript
wtb.sendImmediate({
  key: 'value', // custom key/value
});
```

### sendBatchLogs
sendBatchLogs(data)

| params  | description                                                                                                                                                       |
|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data    | (required)  like Array<Record<string, any>>                                                                                                                                          |

```typescript
wtb.sendBatchLogs([{ key: 'value' }]);
```

### sendBatchLogsImmediate

sendBatchLogsImmediate(data)

| params  | description                                          |
|:--------|:-----------------------------------------------------|
| data    | (required) like Array< Record<string, any>[]>                              |

```typescript
wtb.sendBatchLogsImmediate([{ key: 'value' }])
```
## Security

If you discover a potential security issue in this project, or think you may
have discovered a security issue, we ask that you notify Bytedance Security via our [security center](https://security.bytedance.com/src) or [vulnerability reporting email](sec@bytedance.com).

Please do **not** create a public GitHub issue.

# License
This project is licensed under the [MIT License](./LICENSE).
