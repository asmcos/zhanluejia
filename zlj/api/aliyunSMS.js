var keystone = require('keystone')
const Core = require('@alicloud/pop-core');
var config = require("./aliconfig")

var client = new Core({
  accessKeyId: config.appid,
  accessKeySecret: config.appsecret,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

function sendSMS (req,res){

	var phonenum = req.body.phone

	if (!phonenum){
		return res.json({code:-4,message:"无手机号码"})
	}	
	var code = ""

	code += Math.floor(Math.random() * Math.floor(10));
	code += Math.floor(Math.random() * Math.floor(10));
	code += Math.floor(Math.random() * Math.floor(10));
	code += Math.floor(Math.random() * Math.floor(10));
	code += Math.floor(Math.random() * Math.floor(10));
	code += Math.floor(Math.random() * Math.floor(10));
	
	console.log(code)

	var sms = keystone.list( "Smscode" ) //models

	var newSms = new sms.model({phone:phonenum,code:code})
	
	newSms.save(function(err,result){

		aliyunSMS(phonenum,code,newSms._id,req,res)
	})
}

function aliyunSMS(phone,code,id,req,res){

	var params = {
  		"RegionId": "cn-hangzhou",
  		"PhoneNumbers": phone,
  		"SignName": "战略家",
  		"TemplateCode": "SMS_177553519",
  		"TemplateParam": "{\"code\":\""+code+"\"}",
	}


	var requestOption = {
  		method: 'POST'
	};

	client.request('SendSms', params, requestOption).then((result) => {
		return res.json({code:0,phoneid:id,message:""})
	}, (ex) => {
  		console.log(ex);
		return res.json({code:-5,message:"sms server error"})
	})

}

function checkCode (req,res,callback){
	var id = req.body.id
    var code = req.body.code
    var phone = req.body.phone


    if (!id || !code || !phone ){
        return res.json({code:-1,message:"参数错误"})
        //缺少 id，或者 code,phone
    }

	var sms = keystone.list( "Smscode" ) //models

    sms.model.findOneAndUpdate({_id:id,code:code,phone:phone},{$inc: { times: 1 }},{returnNewDocument:true},function(err, result){

        if (!result){
            callback({code:-2,message:"验证码错误"})
        }

        if (result.times > 2) {

            callback({code:-3,message:"验证码失效,请刷新验证码"})
        }

		callback({code:0,message:"验证成功"})

    })
	

	
}

exports = module.exports.sendSMS = sendSMS
exports = module.exports.checkCode = checkCode

