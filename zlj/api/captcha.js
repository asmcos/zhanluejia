var keystone = require('keystone');
var svgCaptcha = require('svg-captcha');

exports.new = module.exports.new = function(req,res){

	var captcha = keystone.list( "Captcha" ) //models


	var svg = svgCaptcha.createMathExpr({mathMin:1,noise:3,
										 mathMax:99,background: '#cc9966',color:true})

	var newcap = new  captcha.model({result:svg.text})	

	newcap.save(function(err,result) {
		return res.json({id:result.id,data:svg.data})
	});

}
