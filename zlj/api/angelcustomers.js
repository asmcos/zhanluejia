
var keystone = require('keystone')
const child = require('child_process')
var rediscmd =  require('../../redis/command')


// 提交一个抖音请求，
// 求关注抖音号
// 求点抖音视频

function createdy(req, res) {

	if (!req.user){
		return res.json({code:-1,message:"Your need login"})
	}


	var content = req.body.content
	var eventType = req.body.eventType

	cmd = 'python3 ./dy.py "' + content +'" ' + eventType

	var pushevent = keystone.list( "Pushevent")
	// 1 抖音
	var p = new pushevent.model({author:req.user,platform:1,
		eventType:parseInt(eventType)})

	child.exec(cmd, function(err, result) {

    	ret = result.split("\n")


		p.nickname = ret[0]
		p.eventId = ret[1]
		// 查找库里是否提交过
		pushevent.model.findOne({author:req.user,
			platform:1,
			eventType:parseInt(eventType),
			eventId:ret[1]
		},function(err,doc){

			if(doc){
				return res.json({code:-1,message:"你已经提交过"})
			} else {
				//没提交存库，存库
				p.save(function(){
					if (eventType == "1"){

						return res.json({code:0,message:"ok",data:{name:ret[0],uid:ret[1]}})
					} else{

						return res.json({code:0,message:"ok",data:{name:ret[0],itemId:ret[1]}})
					}
				}) //save
			} //else
		}) //findOne

	})
}

// 已经完成了一个交易

async function createpushex(req, res) {

	if (!req.user){
		return res.json({code:-1,message:"Your need login"})
	}

	if (!req.body.pusheventid){
		return res.json({code:-2,message:"提交参数错误"})
	}
	if (!req.body.targetUser){
		return res.json({code:-2,message:"提交参数错误"})
	}

	//交易库
	var pusheventex = keystone.list( "Pusheventex")
	var pushevent = keystone.list( "Pushevent")

	// 获取作者在同平台的nickname
	// 查找最后一条记录
	var p = await pushevent.model.findOne({author:req.user,platform:req.body.platform})
	.sort({ _id: -1 })

	if (!p){
		return res.json({code:-4,message:"你没有登记该平台，不能操作此项"})
	}

	var nickname = p.nickname

	var pe = pusheventex.model()

	pusheventex.model.findOne({author:req.user,
	pushevent:req.body.pusheventid},function(err,doc){
		if(doc){
			return res.json({code:-3,message:"你已经提交过"})
		} else {
			pe.author    = req.user
			pe.pushevent = req.body.pusheventid
			pe.nickname = nickname
			pe.targetUser = req.body.targetUser
			pe.save(function(){
				rediscmd.pushevent_hset(req.user._id,req.body.pusheventid,0)
				return res.json({code:0,message:"提交成功"})
			})
		}
	})
}

function confirmpushex(req, res) {

	if (!req.user){
		return res.json({code:-1,message:"Your need login"})
	}

	if (!req.body.pusheventexid){
		return res.json({code:-2,message:"提交参数错误"})
	}
	//交易库
	var pusheventex = keystone.list( "Pusheventex")

	pusheventex.model.findOne({_id:req.body.pusheventexid,targetUser:req.user})
	.populate({path: 'pushevent', select: {'author':1}})
	.exec (function(err,doc){

		if(!doc){
			return res.json({code:-3,message:"不存在这条记录"})

		} else {
			var t = new Date()
			pusheventex.model.findOneAndUpdate({_id:req.body.pusheventexid},{confirm:1,confTime:t},function(){

				rediscmd.pushevent_hset(doc.author+"",doc.pushevent._id+"",1)
				return res.json({code:0,message:"提交成功"})
			})
		}
	})
}

function listpushevent(req,res){

	var pushevent = keystone.list( "Pushevent")

	var l = 10
	var s = 0
	var sort = '-updateTime'
	if (req.query.limit){
	  l = req.query.limit
	}

	l = parseInt(l)

	if (req.query.skip){
	  s = req.query.skip
	}
	s = parseInt(s)

	if (req.query.sort){
		sort = req.query.sort
	}
	if (req.query.myevent){
		var options = {status:1,author:req.user}
	} else {
		var options = {status:1}
	}

	pushevent.model.find(options)
				.skip(s)
				.limit(l)
				.sort(sort)
				.populate({path: 'author', select: {'name':1,'avatar':1}})
				.exec(async function (err, pushevents) {
					if (err) return res.json(err);


					var userpushevents = []
					if (req.user&&pushevents.length>0){
						pusheventlist = pushevents.map(function(a){
							return a._id + ""
						})
						userpushevents = await rediscmd.pushevent_hmget(req.user._id,pusheventlist)
					}

					return res.json({pushevents,userpushevents})
				})

}

function listpusheventex(req,res){

	var pusheventex = keystone.list( "Pusheventex")

	var l = 10
	var s = 0
	var sort = '-updateTime'
	if (req.query.limit){
	  l = req.query.limit
	}

	l = parseInt(l)

	if (req.query.skip){
	  s = req.query.skip
	}
	s = parseInt(s)

	if (req.query.sort){
		sort = req.query.sort
	}

	pusheventex.model.find({status:1})
				.skip(s)
				.limit(l)
				.sort(sort)
				.populate({path: 'author', select: {'name':1,'avatar':1}})
				.populate({path: 'pushevent', select: {'nickname':1,'platform':1,'eventType':1,'author':1}})
				.exec(async function (err, pusheventexs) {
					if (err) return res.json(err);

					return res.json({pusheventexs})
				})

}

function mypusheventexs(req,res){

	if (!req.user){
		return res.json({code:-1,message:"Your need login"})
	}

	var pusheventex = keystone.list( "Pusheventex")

	var l = 10
	var s = 0
	var sort = '-updateTime'
	if (req.query.limit){
	  l = req.query.limit
	}

	l = parseInt(l)

	if (req.query.skip){
	  s = req.query.skip
	}
	s = parseInt(s)

	if (req.query.sort){
		sort = req.query.sort
	}

	if(req.query.mydone){
		var options = {status:1,author:req.user}
	} else {
		var options = {status:1,targetUser:req.user}
	}

	pusheventex.model.find(options)
				.skip(s)
				.limit(l)
				.sort(sort)
				.populate({path: 'author', select: {'name':1,'avatar':1}})
				.populate({path: 'pushevent', select: {'nickname':1,'platform':1,'eventType':1}})
				.exec(async function (err, pusheventexs) {
					if (err) return res.json(err);

					return res.json({pusheventexs})
				})

}



module.exports = {
	createdy:createdy,
	createpushex:createpushex,
	confirmpushex:confirmpushex,
	listpushevent:listpushevent,
	listpusheventex:listpusheventex,
	mypusheventexs:mypusheventexs,
}
