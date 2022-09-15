# TLS JS SDK 
[English](https://github.com/volcengine/tls-js-sdk/blob/master/README.md)

这是 TLS 在浏览器中的 js sdk。
> TLS 是 Tinder Log Service（日志服务） 的简称。

# 安装

```shell
npm install -S @volcengine/tls-js-sdk
```

# 使用

在 es 模块文件中导入
```typescript
import { WebTrackerBrowser } from '@volcengine/tls-js-sdk';

const wtb = new WebTrackerBrowser({
  host: 'your host',
  projectId: 'your projectId',
  topicId: 'your topicId',
});

```

在页面里直接使用
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
浏览器中 web tracker 的类

```typescript
import { WebTrackerBrowser } from '@volcengine/tls-js-sdk';

const wtb = new WebTrackerBrowser({
  host: 'your host', // 必需
  projectId: 'your projectId', // 必需
  topicId: 'yourt topicId', // 必需
  protocol: 'your protocol', // 可选.默认值 https
  time: 'batch log time interval', // 可选.默认值10，单位秒
  count: 'batch log limit', // 可选.默认值10.
  source: 'log source', // 可选
});
```

下面是 WebTrackerBrowser 实例上的方法

### send
发送单条日志

send(data)

| 参数      | 描述                                                                     |
|:--------|:-----------------------------------------------------------------------|
| data    | (必填) 形如 {  [index: string]: any } |

```typescript
wtb.send({
  key: 'value', // 自定义键值
});
```
### sendImmediate

sendImmediate(data)

| 参数      | 描述                                             |
|:--------|:-----------------------------------------------|
| data    | (必填) like { [index: string]: any }             |

```typescript
wtb.sendImmediate({
  key: 'value', // 自定义键值
});
```

### sendBatchLogs
sendBatchLogs(data)

| 参数      | 描述                                                                                                                                                                           |
|:--------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data    | (必填)  形如 Array<Record<string, any>>                                                                                                                                          |

```typescript
wtb.sendBatchLogs([{ key: 'value' }]);
```

### sendBatchLogsImmediate
立即发送批量日志

sendBatchLogsImmediate(data)

| 参数      | 描述                                           |
|:--------|:---------------------------------------------|
| data    | (必填) 形如 Array<Record<string, any>>           |

```typescript
wtb.sendBatchLogsImmediate([{
  key: 'value'
}])
```
## 安全
如果你在此项目中发现潜在的安全问题，或认为你可能
发现安全问题，我们要求你通过我们的[安全中心](https://security.bytedance.com/src) 或[漏洞报告电子邮件](sec@bytedance.com) 通知字节跳动安全。

请不要**创建公共 GitHub 问题。

# 开源协议
本项目开源协议为 [MIT License](./LICENSE).

