var OAuth = require('wechat-oauth');
var config = require('./config')

var api = new OAuth(config.appid, config.secret);

module.exports.wxapi = api

