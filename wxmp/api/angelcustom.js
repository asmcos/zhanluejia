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

	if (message.ToUserName != 'gh_26c05261879e'){
		return res.json({message:'你不是我的公众号'})
	}

	var openId = message.FromUserName

	//wxmpopenId
	wxapi.getUser(openId,function(err,result1){
		console.log(result1)
		res.reply('欢迎您来战略家-弹朋友');
	}
})

exports = module.exports={
    angelcustom:angelcustom,

}
