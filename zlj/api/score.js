
var keystone = require('keystone')

/*
Score.add({
  	author: { type: Types.Relationship, ref: 'User' }, //积分人
  	user: { type: Types.Relationship, ref: 'User' },  //事件发起人
  	eventType: {type:Types.Number}, //1 发提问，2 回答 3 点赞（对回答的） 4， 评论 5 转发
	ObjID: {type:String},  //id number
	score: {type:Types.Number},    //单次事件分数
	total: {type:Types.Number},    //累计积分
	createTime: { type: Types.Datetime, default: Date.now},

});*/
//1 发提问，--> 2 分，自己得分
//2 回答 --> 5 分 自己得分
//3 点赞(对回答的)  --> 1 分，作者得分
//4，评论  --> 2 分，自己+作者都得分
//5 转发 -->2 分，自己得分


function updateScorebyAnswer(res,user, ObjID) {


    var score  = keystone.list( "Score" )
	var author  = keystone.list( "User" )

	var options = {
		$inc:{"score":5},
	}
    author.model.findOneAndUpdate({_id:user.id},options,{},function(err, updatedObject){
            if (err){
                return res.json({code:-1,message:"update answer err"})
            }

        	var Newscore = new score.model({author:updatedObject,
				user:user,
				ObjID:ObjID,
				eventType:2, //answer
				score:5,
				total:updatedObject.score+5
			})
			Newscore.save(function(err){

				return res.json({code:0,message:"成功"})
			}) //save

    }) //findOneAndUpdate

}

//3 点赞  --> 1 分，作者得分

async function updateScorebylike(res,author,user, ObjID,answer) {


    var score  = keystone.list( "Score" )
	var authorscore  = keystone.list( "User" )

	var options = {
		$inc:{"score":1},
	}

	var ret = await score.model.findOne({
					user:user,
					ObjID:ObjID, //like object id
					eventType:3, //like
					})

	if(ret){
		return res.json({code:0,message:"成功",updatedObject:answer})
	}
	//don't +1

    authorscore.model.findOneAndUpdate({_id:author},options,{},function(err, updatedObject){
            if (err){
                return res.json({code:-1,message:"update answer err"})
            }



        	var Newscore = new score.model({author:updatedObject,
				user:user,
				ObjID:ObjID, //like object id
				eventType:3, //like
				score:1,
				total:updatedObject.score+1
			})
			Newscore.save(function(err){

				return res.json({code:0,message:"成功",updatedObject:answer})
			}) //save

    }) //findOneAndUpdate

}



module.exports = {
	updateScorebyAnswer:updateScorebyAnswer,
	updateScorebylike:updateScorebylike,

}
