
var keystone = require('keystone')
var question = require('./question')
var rediscmd =  require('../../redis/command')

updateQuesionbyNewAnswer = question.updateQuesionbyNewAnswer

var imgUrlFun = function(str){
        var data = '';
        if ( str ){
            str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
                  data =  capture;
            });
        }
        return data
}



function create(req, res) {


      var answer  = keystone.list( "Answer" )

      if (!req.user){
          return res.json({code:-1,message:"Your need login"})
      }

      thumbnail = imgUrlFun(req.body.content)

      var item = answer.model()


      if (thumbnail) {
          item.thumbnail = thumbnail
      }
      item.createTime = item.updateTime = new Date()

      answer.updateItem(item,req.body,{},function(err){
          if (err){
              return res.json({code:'-1',message:"save answer error"})
          }

          if (req.user){
              item.author = req.user
              item.save(function (err) {
                  if (err) return res.json(err);
                  updateQuesionbyNewAnswer(req,res,item,function(){
                      return res.json({code:0,message:"success"})
                  })
              })

          }


      })


}
function del(req,res){

    if (!req.user){
        return res.json({code:-1,message:"Your need login"})
    }



      var answer  = keystone.list( "Answer" )

      var answerid = req.query.answerid


      var item = answer.model()

      var authorid = req.user._id

      //0 删除，1正常

      answer.model.findOneAndUpdate({_id:answerid,author:authorid},{status:0},{},function(err, updatedObject){
          console.log(err,updatedObject)
          if (err){
              return res.json({code:-1,message:"update question err"})
          }
          if (updatedObject != null){
              return res.json({code:0,message:'delete success'})
          }

          return res.json({code:-2,message:"delete failed"})
      })


}

function list(req,res){
    var answer  = keystone.list( "Answer" )

    var l = 10
    var s = 0
    if (req.query.limit){
      l = req.query.limit
    }

    l = parseInt(l)

    if (req.query.skip){
      s = req.query.skip
    }
    s = parseInt(s)

    answer.model.find({status:1})
                .skip(s)
                .limit(l)
                .sort('-updateTime')
                .populate({path: 'author', select: {'name':1,'avatar':1}})
                .populate({path: 'question', select:{'title':1,'answerCount':1} })
                .exec(async function (err, answers) {
                    if (err) return res.json(err);
                    var userlikes = []
                    if (req.user&&answers.length>0){
                        answerlist = answers.map(function(a){
                            return a._id + ""
                        })
                        userlikes = await rediscmd.answerlike_hmget(req.user._id,answerlist)
                    }

                    return res.json({answers,userlikes})
                })

}

function myanswers(req,res){
    var answer  = keystone.list( "Answer" )

    var l = 10
    var s = 0
    if (req.query.limit){
      l = req.query.limit
    }

    l = parseInt(l)

    if (req.query.skip){
      s = req.query.skip
    }
    s = parseInt(s)

    var userid = req.user._id

    answer.model.find({author:userid,status:1})
                .skip(s)
                .limit(l)
                .sort('-updateTime')
                .populate({path: 'author', select: {'name':1,'avatar':1}})
                .populate({path: 'question', select:{'title':1,'answerCount':1}})
                .exec(async function (err, answers) {
                    if (err) return res.json(err);
                    var userlikes = []
                    if (req.user&&answers.length>0){
                        answerlist = answers.map(function(a){
                            return a._id + ""
                        })
                        userlikes = await rediscmd.answerlike_hmget(req.user._id,answerlist)
                    }

                    return res.json({answers,userlikes})
                })

}

// a answer and it's question
async function answer(req,res){
    var answer  = keystone.list( "Answer" )

    if (!req.query.answerid){
        return res.json({code:-1,message:"no answerid "})
    }

    var answerid = req.query.answerid

    await answer.model.updateOne({_id:answerid,status:1}, {$inc: {pageviews:1}});

    answer.model.findOne({_id:answerid,status:1})
                .populate({path: 'author', select: {'name':1,'avatar':1}})
                .populate({path: 'question', select:{'title':1,'answerCount':1,'content':1,'answers':1}})
                .exec(async function (err, answer) {
                    if (err) return res.json(err);
                    var userlike = ""
                    if (req.user){
                        userlike = rediscmd.answerlike_hget(req.user._id,answerid)
                    }

                    return res.json({answer,userlike})
                })

}


async function updateanswer(req,res){
    var answer  = keystone.list( "Answer" )

    if (!req.body.answerid){
        return res.json({code:-1,message:"no answerid"})
    }

    var answerid = req.body.answerid

    if (!req.user){
        return res.json({code:-2,message:"Your need login"})
    }

    var  thumbnail = imgUrlFun(req.body.content)


    answer.model.findOneAndUpdate({_id:answerid,author:req.user.id},{content:req.body.content,thumbnail:thumbnail},{},function(err, updatedObject){
            if (err){
                return res.json({code:-1,message:"update answer err"})
            }
            return res.json({code:0,message:"修改成功"})

    })




}

async function like(req, res) {

    if (!req.query.answerid){
        return res.json({code:-1,message:"no answerid "})
    }

    if (!req.user){
        return res.json({code:-1,message:"no user "})
    }

    var answerid = req.query.answerid




    var answer  = keystone.list( "Answer" )
    var like  = keystone.list( "Answerlike" )
    var count = 1 ;

    //likestatus == 1的时候，count = -1 ,也就是取消点赞
    //likestatus == null，或者 0的时候 +1,也就是点赞
    var likestatus = await rediscmd.answerlike_hget (req.user._id,answerid+"")


    if( likestatus == 1){
        count = -1
        likestatus = -1
    } else {
        likestatus = 1
    }

    var updateDocument = {
        $inc:{"likeCount":count},
    }

    rediscmd.answerlike_hset(req.user._id,answerid+"")

    answer.model.findOneAndUpdate({_id:answerid},updateDocument,{returnNewDocument:true,new:true},function(err, updatedObject){


            if (err){
                return res.json({code:-1,message:"update answer err"})
            }

            var l = new like.model({user:req.user,answer:answerid,status:likestatus})

            l.save(function(err){
                return res.json({code:0,message:"like ok",updatedObject})
            })
    })

}



function updateAnswerbyNewComment(req,res,comment,callback){
    var answer  = keystone.list( "Answer" )
    var updateDocument = {
        $inc:{"commentCount":1},
        updateTime: new Date(),
        $push:{"comments":comment},
    }
    answer.model.findOneAndUpdate({_id:comment.Answer},updateDocument,{},function(err, updatedObject){
            if (err){
                return res.json({code:-1,message:"update answer err"})
            }

            callback()
    })
}


module.exports = {
	create:create,
    answer:answer,
    updateanswer:updateanswer,
    list:list,
    like:like,
    del:del,
    myanswers:myanswers,
    updateAnswerbyNewComment:updateAnswerbyNewComment,

}
