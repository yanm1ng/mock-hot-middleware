var express = require('express')
var app = express()
var port = 3000
var mockHotMiddleware = require('../index.js')

app.use(mockHotMiddleware({
  prefix: '/plateform' // prefix or suffix
}))

app.get('/', function(req, res) {
  res.send('hello world');
})

app.listen(port, function () {
  console.log('express listening on port ' + port);
})