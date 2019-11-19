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


exports.login = module.exports.login = function(req,res){

	return res.json(req.user)

}
exports.register = module.exports.register = function(req,res){
	

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


}
