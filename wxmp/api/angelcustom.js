var keystone = require('keystone')
var config = require('../config')


var wechat = require('wechat');
var config = {
  token: config.token,
  appid: config.appid ,
  encodingAESKey: config.encodingAESKey,
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

angelcustom  = wechat(config,function(req,res){
	var message = req.weixin;
	console.log(message);
	res.reply('欢迎您来战略家-弹朋友');

})

exports = module.exports={
    angelcustom:angelcustom,

}
