var keystone = require('keystone');
var svgCaptcha = require('svg-captcha');
var aliyunSMS = require('./aliyunSMS')

exports.new = module.exports.new = function(req,res){

	var captcha = keystone.list( "Captcha" ) //models


	var svg = svgCaptcha.createMathExpr({mathMin:1,noise:3,
										 mathMax:99,background: '#cc9966',color:true})

	var newcap = new  captcha.model({result:svg.text})	

	newcap.save(function(err,result) {
		return res.json({id:result.id,data:svg.data})
	});

}


//ajax post , datajson,
exports.getCode = module.exports.getCode = function(req,res){


	var captcha = keystone.list( "Captcha" ) //models

	var id = req.body.id
    var code = req.body.code
	

	if (!id || !code){
		return res.json({code:-1,message:"参数错误"})
	    //缺少 id，或者 code
	}
	
	captcha.model.findOneAndUpdate({_id:id,result:code},{$inc: { times: 1 }},{returnNewDocument:true},function(err, result){

		if (!result){
			return res.json({code:-2,message:"验证码错误"})
		}	

		if (result.times > 2) {
		
			return res.json({code:-3,message:"验证码失效,请刷新验证码"})
		}

		aliyunSMS.sendSMS(req,res)
	})
}
