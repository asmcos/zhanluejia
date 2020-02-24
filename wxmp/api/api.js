var keystone = require('keystone')

/*
    name: { type: Types.Name, required: true, index: true }, //firstname is weapp nickname
    email: { type: Types.Email, initial: true, required: true },
    password: { type: Types.Password, initial: true, required: true },
    avatar: {type:Types.Url},
    weappopenId: {type:Types.Text},                 // weapp openId
    wxunionId: {type:Types.Text},                   // weapp unionId
    phoneNum: {type:Types.Number},
    wxmpopenId: {type:Types.Text},
    registerType: {type:Types.Number,default:0} // 0:keystone orginal,1:weapp,2:wxmp

*/


exports.my = module.exports.my = function(req,res){
	if (req.user){
		req.user.password = ""
		return res.json(req.user)
	}
	return res.json({code:-1,message:"no login"})

}

exports.getConfig = module.exports.getConfig = function(req,res){

    var param = {
      url: decodeURIComponent(req.query.url) ||""
     };


	mpapi.getJsConfig(param,function(ret,data){
		if (ret){
			return res.json({code:-1,message:"wechat get config failed"})
		}
		return res.json(data)
	})
}
exports.callback = module.exports.callback = function(req,res){

	var code = req.query.code;

	wxapi.getAccessToken(code, function (err, result) {
		openid = result["data"]["openid"]
		wxapi.getUser(openid,function(err,result1){

	        //openid, nickname, headimgurl,unionid

    	    var U = keystone.list( "User" )

        	var profile = {
                 wxmpopenId: result1['openid'],
                 name: {first:result1['nickname']},
                 avatar: result1['headimgurl'],
                 wxunionId: result1['unionid'],
                 password: "wxmp",
        	}
       		U.model.findOneAndUpdate({wxunionId:result1['unionid']},profile,{upsert:true,returnNewDocument:true},function(err, updatedObject){


            	U.model.findOne({wxunionId:result1['unionid']},function(err,newU){
                	keystone.session.signinWithUser(newU, req, res, function () {

                    	return res.json({result:true,name:result1['nickname'],headimgurl:result1['headimgurl']})

                	}) //keystone.session

            	}) //findOne
        	}) //U.model.findOneAndUpdate



		}) //wxapi.getUser

	})	//wxapi.getAccessToken
}
