var keystone = require('keystone')
var aliyunSMS = require('./aliyunSMS')
var bcrypt = require('bcryptjs');
var fs = require('fs')


/*
 * 给用户分配一个随机头像，图片范围见www/img/icon目录
 */
var img = require("./mkjson");

var urlpath = "/zlj/img/icon/"

function randavatar(img){
	var length = img.length - 1;

	var rand = Math.floor(Math.random() * Math.floor(length));

	return img[rand]
}

function randuser(user){
	var length = user.length - 1;

	var rand = Math.floor(Math.random() * Math.floor(length));

	return user[rand]
}

// login and register user
exports.login = module.exports.login = function(req,res){

	var imglist = img.getImgList(__dirname + "/../www/img/icon/")
	var userlist = img.getNick()

	aliyunSMS.checkCode(req,res,function(data){
		if (data.code != 0 ){

			return res.json(data)
		}

		//登录或者注册
		var U = keystone.list( "User" )

		var hashpw = bcrypt.hashSync(req.body.code)

		var avatar = urlpath + randavatar(imglist)
		var nick = randuser(userlist)

		var profile = {
			phoneNum:req.body.phone,
			$setOnInsert:{name:{first:nick},password:hashpw,avatar:avatar}, //only for new user,don't update for old user
		}

		U.model.findOneAndUpdate({phoneNum:req.body.phone},profile,{upsert:true,returnNewDocument:true},function(err, updatedObject){
			 U.model.findOne({phoneNum:req.body.phone},function(err,newU){



			 	keystone.session.signinWithUser(newU, req, res, function () {
					keystone.callHook(newU, 'post:signin', req, function (err) {
                                if (err) return res.status(500).json({ error: 'post:signin error', detail: err });

                                return res.json(data)
							})//callHook
				})//signiWithUser

			})//findOne
		})//U.model

	})//aliyunSMS


}

exports.loginpw = module.exports.loginpw = function(req,res){

	var U = keystone.list( "User" )

	U.model.findOne({phoneNum:req.body.phone},function(err,newU){

	   if(!newU){
		   return res.json({code:-1,message:"密码或者账号不存在"})
	   }
		//比较密码
	   var ret = bcrypt.compareSync(req.body.password,newU.password)

	   if (ret){

		   keystone.callHook(newU, 'pre:signin', req, function (err) {
			   if (err) return res.status(500).json({ error: 'pre:signin error', detail: err });
		       keystone.session.signinWithUser(newU, req, res, function () {
			       keystone.callHook(newU, 'post:signin', req, function (err) {
							  if (err) return res.status(500).json({ error: 'post:signin error', detail: err });

							   return res.json({code:0,message:"登录成功"})
					   })//callHook
				})//signinWithUser


		   })//pre:signin
	   } else {
		   return res.json({code:-1,message:"密码或者账号不存在"})
	   }
   })//findOne
}

exports.register = module.exports.register = function(req,res){
	var imglist = img.getImgList(__dirname + "/../www/img/icon/")
	var userlist = img.getNick()

	aliyunSMS.checkCode(req,res,function(data){
		if (data.code != 0 ){

			return res.json(data)
		}


		//注册
		var U = keystone.list( "User" )

		var hashpw = bcrypt.hashSync(req.body.password,1)

		var avatar = urlpath + randavatar(imglist)
		var nick = randuser(userlist)

		var profile = {
			phoneNum:req.body.phone,
			password:hashpw, //only update password
			$setOnInsert:{name:{first:nick},avatar:avatar}, //only for new user,don't update for old user
		}



		U.model.findOneAndUpdate({phoneNum:req.body.phone},profile,{upsert:true,returnNewDocument:true},function(err, updatedObject){

			 U.model.findOne({phoneNum:req.body.phone},function(err,newU){

				keystone.callHook(newU, 'pre:signin', req, function (err) {
					if (err) return res.status(500).json({ error: 'pre:signin error', detail: err });
					keystone.session.signinWithUser(newU, req, res, function () {
						keystone.callHook(newU, 'post:signin', req, function (err) {
                                if (err) return res.status(500).json({ error: 'post:signin error', detail: err });

                                return res.json(data)
							})//callHook post:signin
				    })//signinWithUser
			    })//pre:signin

			})//findOne
		})//U.model

	})//aliyunSMS

}

exports.my = module.exports.my = function(req,res){

	if (req.user){
		req.user.password = ""
		return res.json(req.user)
	}
	return res.json({code:-1,message:"no login"})
}

exports.uploadavatar = module.exports.uploadavatar = function(req,res){

	if (!req.user){
		return res.json({code:0,message:"no login"})

	}
	console.log(req)
	var uploadpath = __dirname + "/../../public/uploads/"
	var base64Data = req.body.img.replace(/^data:image\/\w+;base64,/, "");
	var dataBuffer = new Buffer(base64Data, 'base64');
	var randname = Math.floor(Math.random() * Math.floor(100)) + "";
	var filename  = Date.now()+randname+req.body.filename
	var avatarurl = "/static/uploads/" + filename
	fs.writeFile(uploadpath+filename, dataBuffer, function(err) {
		if(err){
		  return res.send(err);
		}

		return res.json({avatarurl:avatarurl})


	});

}

exports.updateuser = module.exports.updateuser = function(req,res){

	if (!req.user){
		return res.json({code:0,message:"no login"})
	}

	var U = keystone.list( "User" )

	var userinfo = {
		avatar:req.body.avatarurl,
		name:{first:req.body.firstname}
	}

	U.model.findOneAndUpdate({_id:req.user._id},userinfo,{upsert:true,returnNewDocument:true},function(err, updatedObject){
		return res.json(req.user)
	  })

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
