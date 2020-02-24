var OAuth = require('wechat-oauth');
var WechatAPI = require('wechat-api');


var config = require('./config')

var wxapi = new OAuth(config.appid, config.secret);
var mpapi = new WechatAPI(config.appid, config.secret);


module.exports.wxapi = wxapi //获取用用信息，openid等
module.exports.mpapi = mpapi //获取公众号相关接口，分享，支付，卡券，管理用户等
