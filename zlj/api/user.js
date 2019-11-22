var keystone = require('keystone')
var aliyunSMS = require('./aliyunSMS')
var bcrypt = require('bcrypt-nodejs');


/*
 * 给用户分配一个随机头像，图片范围见www/img/icon目录
 */
var img = require("./mkjson");

var imglist = img.getImgList(__dirname + "/../www/img/icon/")
var urlpath = "/zlj/img/icon/"

function randavatar(img){
	var length = img.length;
	
	var rand = Math.floor(Math.random() * Math.floor(length));	

	return img[rand]
}


// login and register user
exports.login = module.exports.login = function(req,res){


	aliyunSMS.checkCode(req,res,function(data){
		if (data.code != 0 ){

			return res.json(data)
		}

		//登录或者注册
		var U = keystone.list( "User" )
	
		var hashpw = bcrypt.hashSync(req.body.code)

		var avatar = urlpath + randavatar(imglist)	

		var profile = {
			phoneNum:req.body.phone,
			$setOnInsert:{password:hashpw,avatar:avatar}, //only for new user 
		}	

		U.model.findOneAndUpdate({phoneNum:req.body.phone},profile,{upsert:true,returnNewDocument:true},function(err, updatedObject){
			 U.model.findOne({phoneNum:req.body.phone},function(err,newU){
			 	keystone.session.signinWithUser(newU, req, res, function () {
                        return res.json(data)
                })
			})//findOne
		})//U.model

	})//aliyunSMS


}
exports.register = module.exports.register = function(req,res){
	

}






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

/* update
        req.list.model.findById(data.id, function (err, item) {
            if (err) return done({ statusCode: 500, error: 'database error', detail: err, id: data.id });
            if (!item) return done({ statusCode: 404, error: 'not found', id: data.id });
            req.list.updateItem(item, data, { files: req.files, user: req.user }, function (err) {
                if (err) {
                    err.id = data.id;
                    // validation errors send http 400; everything else sends http 500
                    err.statusCode = err.error === 'validation errors' ? 400 : 500;
                    return done(err);
                }
                // updateCount++;
                done(null, req.query.returnData ? req.list.getData(item) : item.id);
            });
        });

*/

/* create
    var item = new req.list.model();

    req.list.updateItem(item, req.body, {
        files: req.files,
        ignoreNoEdit: true,
        user: req.user,
    }, function (err) {
        if (err) {
            var status = err.error === 'validation errors' ? 400 : 500;
            var error = err.error === 'database error' ? err.detail : err;
            return res.apiError(status, error);
        }
        res.json(req.list.getData(item));
    });

 */


