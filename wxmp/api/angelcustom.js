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

	if (message.ToUserName != 'gh_26c05261879e'){
		return res.json({message:'公众号号码不对'})
	}

    var U = keystone.list( "User" )
	var openId = message.FromUserName
	//1. find old user ,实际上应该查找UnionId才对，不过后来采用的是update
	//也不会有BUG
	var u = await U.model.findOne({wxmpopenId: openId})

	if (u) { //isExist

		do_message(u,req,res)
	} else {
		// create new user

		//wxmpopenId
		mpapi.getUser(openId,function(err,result1){
			if (err){
				console.log(err)
				return res.replay("从微信获取你的信息失败,要不你1分钟后再发一次？")
			}
			//save 用户信息
			var profile = {
					 wxmpopenId: result1['openid'],
					 name: {first:result1['nickname']},
					 avatar: result1['headimgurl'],
					 wxunionId: result1['unionid'],
					 password: "wxmp",

				}
			U.model.findOneAndUpdate({wxunionId:result1['unionid']},profile,{upsert:true,returnNewDocument:true},function(err, updatedObject){

					U.model.findOne({wxunionId:result1['unionid']},function(err,newU){

						do_message(newU,req,res)
					}) //findOne
				})//findandupdate
		}) //getUser
	} //else


})

function do_text(u,req,res){
	var message = req.weixin;
	if (message.Content == '弹朋友'){
		res.reply("稍等，我们马上给你准备一个朋友")
	}
}
function do_image(u,req,res){
	var message = req.weixin;

	res.reply('收到你的图片了,我们要审核的哦。通过后，才能弹给别人。');
}

function do_message(u,req,res){

	console.log(message)

	if (message.MsgType === 'text'){
		do_text (u,req,res)
	} else if (message.MsgType === 'image'){
		do_image (u,req,res)
	}
	res.reply('欢迎您来战略家-弹朋友');
}

exports = module.exports={
    angelcustom:angelcustom,

}
