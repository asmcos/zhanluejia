
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

    answer.model.find()
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

    answer.model.find({author:userid})
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
    list:list,
    like:like,
    myanswers:myanswers,
    updateAnswerbyNewComment:updateAnswerbyNewComment,

}
