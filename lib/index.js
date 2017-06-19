'use strict';

var queryString = require('querystring')
var URL = require('url')
var path = require('path')
var fs = require('fs')
var gulp = require('gulp')

module.exports = function (options) {
  var prefix = options.prefix || ''
  var suffix = options.suffix || ''
  var mockPath = options.path || 'mock'

  return function (req, res, next) {
    var reqUrl = req.url
    var isMockApi = false

    if (prefix) {
      isMockApi = reqUrl.startsWith(prefix)
    } else if (suffix) {
      reqUrl = reqUrl.split('?')[0]
      isMockApi = reqUrl.endsWith(suffix)
    }

    if (isMockApi) {
      var contentType = req.headers['content-type'] || 'application/json'
      res.append('Content-Type', contentType)

      var doMock = function (params, pathName) {
        try {
          if (prefix) {
            pathName = pathName.replace(prefix, '')
          } else if (suffix) {
            pathName = pathName.replace(suffix, '')
          }
          var parts = pathName.replace(/^\//, '').split(/\//)
          pathName = path.resolve(mockPath, parts.join('/'))
          pathName += '.js'
          fs.exists(pathName, function (exist) {
            if (exist) {
              try {
                var content = require(pathName)
                if (typeof content === 'function') {
                  content = content(params)
                }
                res.status(200).json(content)
              } catch (e) {
                res.status(500).json({
                  message: pathName + '文件错误'
                })
              }
            } else {
              res.status(404).json({
                message: pathName + '文件不存在'
              })
            }
          });
        } catch (e) {
          res.status(500).end()
        }
      };

      var method = req.method.toUpperCase()
      var urlInfo = URL.parse(reqUrl, true)
      if (/multipart\/form-data/.test(contentType)) {
        req.once('data', function (data) {
          doMock(queryString.parse(String(data, encoding)), urlInfo.pathname)
        })
        return
      }
      var params = ''
      if (method === 'POST') {
        req.on('data', function (data) {
          params += data
        })
        req.on('end', function () {
          if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
            params = queryString.parse(params)
          } else if (contentType.indexOf('application/json') > -1) {
            params = JSON.parse(params)
          }
          doMock(params, urlInfo.pathname)
        })
      } else if (method === 'GET') {
        params = urlInfo.query
        doMock(params, urlInfo.pathname)
      }
      // mock文件变化，清除缓存
      gulp.watch(`${mockPath}/**/*`).on('change', change => {
        delete require.cache[require.resolve(change.path)]
      })
    } else {
      return next()
    }
  }
}