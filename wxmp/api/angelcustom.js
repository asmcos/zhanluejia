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
		return res.reply({message:'公众号号码不对'})
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
				return res.reply("从微信获取你的信息失败,要不你1分钟后再发一次？")
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

		var T = keystone.list( "Tanpengyou" )
		var Tex = keystone.list( "Tanpengyouex" )
		Tex.model.find({author:u,platform:3},function(err,texs){


			var listtexs =  texs.map(function(a){
			    return a.tanpengyou + ""
			})

			//查找没有这些id的二维码
			T.model.findOne({_id:{$nin:listtexs},platform:3,status:1},function(err,ret){
				if (ret){
					//save a  exchange event
					var tex  = new Tex.model({author:u,tanpengyou:ret,platorm:3})
						tex.save(function(){
							res.reply({
								type: "image",
								content: {
								  mediaId: ret.mediaId
							    }
						    })
						})

			  } else {
				  res.reply("没有新朋友了，都给你了")
			  }
			})

		})

	} else {
		res.reply("欢迎您来战略家-'弹朋友' 功能上线\n1.输入:'弹朋友' 可以获取他人二维码\n2.直接上传自己的二维码可获取更多好友！");
	}
}
function do_image(u,req,res){
	var message = req.weixin;
	//PicUrl
	var T = keystone.list( "Tanpengyou" )

	T.model.findOneAndUpdate({author:u},{qrcode:message.PicUrl,platform:3,status:0,mediaId:message.MediaId},
		{upsert:true},function(err, updatedObject){

		res.reply('收到你的图片了,我们要审核的哦。通过后，才能弹给别人。');
	})
}

function do_message(u,req,res){
	var message = req.weixin;
	console.log(message)

	if (message.MsgType === 'text'){
		do_text (u,req,res)
	} else if (message.MsgType === 'image'){
		do_image (u,req,res)
	} else {
		res.reply("欢迎您来战略家-'弹朋友' 功能上线\n1.输入:'弹朋友' 可以获取他人二维码\n2.直接上传自己的二维码可获取更多好友！");
	}

}

exports = module.exports={
    angelcustom:angelcustom,

}
