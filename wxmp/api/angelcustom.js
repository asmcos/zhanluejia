var keystone = require('keystone')
var config = require('../config')


var wechat = require('wechat');
var config = {
  token: config.token,
  appid: config.appid ,
  encodingAESKey: config.encodingAESKey,
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

angelcustom  = wechat(config,async function(req,res){
	var message = req.weixin;
	console.log(message);

	if (message.ToUserName != 'gh_26c05261879e'){
		return res.json({message:'公众号号码不对'})
	}

    var U = keystone.list( "User" )
	var openId = message.FromUserName
	//1. find old user
	var u = await U.model.findOne({wxmpopenId: openId})

	if (u) { //isExist
		console.log("old user",u)
		do_message(u,req,res)
	} else {
		// create new user

		//wxmpopenId
		mpapi.getUser(openId,function(err,result1){

			//save 用户信息
			var profile = {
					 wxmpopenId: result1['openid'],
					 name: {first:result1['nickname']},
					 avatar: result1['headimgurl'],
					 wxunionId: result1['unionid'],
					 password: "wxmp",
				}
			u = new U.model(profile)
			u.save(function(err){
				console.log("new user",u)
				do_message(u,req,res)
			})
		}) //getUser
	} //else


})

function do_message(u,req,res){
	var message = req.weixin;
	res.reply('欢迎您来战略家-弹朋友');
}

exports = module.exports={
    angelcustom:angelcustom,

}
