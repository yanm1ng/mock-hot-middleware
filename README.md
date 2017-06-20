## mock-hot-middleware

> 服务于前后端分离的项目，提供接口数据 mock 服务并支持 hot-reload 的 express 中间件

### Features
* 配置简单，无需更改项目结构
* mock 文件 随改随生效

### Usage

Install:

```bash
npm install mock-hot-middleware --save-dev
```
In your express entry file:
```javascript
var app = new express（）
var mockHotMiddleware = require('mock-hot-middleware')
...
app.use(mockHotMiddleware({
  prefix: '/plateform', // prefix or suffix
  path: 'mock' // default mock
}))
...
```
### Options

* prefix/suffix: api接口前缀或后缀
* path: mock 文件夹

### Example
如果你想模拟 api => '/plateform/user/getUserInfo' 接口，你可以在项目目录下建立 mock 文件夹，其中 `user/getUserInfo.js` 的内容如下：
```javascript
module.exports = {
  result: "success",
  message: "",
  code: 0000,
  data: {
    name: "yanm1ng",
    age: 21,
    address: "HangZhou",
    major: "Software Engineering"
  }
}
```
or
```javascript
module.exports = function(params) {
  // 对 params 参数的处理
  return {
    result: "success",
    message: "",
    code: 0000,
    data: {
      name: "yanm1ng",
      age: 21,
      address: "HangZhou",
      major: "Software Engineering"
    }
  }
}
```

### License
[MIT](https://github.com/yanm1ng/mock-hot-middleware/blob/master/LICENSE)

