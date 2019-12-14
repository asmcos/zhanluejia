
var keystone = require('keystone')
var rediscmd =  require('../../redis/command')

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


    if (!req.user){
        return res.json({code:-1,message:"Your need login"})
    }


      var question  = keystone.list( "Question" )

      thumbnail = imgUrlFun(req.body.content)

      var item = question.model()

      if (thumbnail) {
          item.thumbnail = thumbnail
      }

      item.createTime = item.updateTime = new Date()

      question.updateItem(item,req.body,{author:req.user},function(err){
          if (err){
              return res.json({code:'-1',message:"save question error"})
          }
          if (req.user){
              item.author = req.user
              item.save(function (err) {
                  if (err) return res.json(err);
                    return res.json({code:0,message:"success"})
              })

          }
          return res.json({code:0,message:"success"})

      })

}

async function list(req, res) {


    var question  = keystone.list( "Question" )
    var tag  = keystone.list( "Tag" )

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

    var tagname = req.query.tag

    if (tagname){
        tagname = decodeURI(tagname)
        var tagid = await tag.model.findOne({name:tagname})

        // 查找的 标签 不存在
        if (!tagid){
            return res.json({questions:[],userlikes:[]})
        }

        question.model.find()
                      .skip(s)
                      .limit(l)
                      .populate('tags')
                      .where('tags').in([tagid])
                      .sort('-updateTime')
                      .populate({ path: 'answers',
                          options: {sort: {'likeCount':-1},
                          limit: 1},
                          populate: {path: 'author', select: {'name':1,'avatar':1}}
                      })
                      .exec(async function (err, questions) {
                          if (err) return res.json(err);

                          var userlikes = []
                          if (req.user && questions.length > 0){
                              answerlist = questions.map(function(a){                              if (a.answers.length > 0){
                                      return a.answers[0]._id + ""
                                  }
                                  return "0"
                              })
                              userlikes = await rediscmd.answerlike_hmget(req.user._id,answerlist)
                          }

                          return res.json({questions,userlikes})
                      })


    } else {
        question.model.find()
                      .skip(s)
                      .limit(l)
                      .sort('-updateTime')
                      .populate({ path: 'answers',
                          options: {sort: {'likeCount':-1},
                          limit: 1},
                          populate: {path: 'author', select: {'name':1,'avatar':1}}
                      })
                      .exec(async function (err, questions) {
                          if (err) return res.json(err);

                          var userlikes = []
                          if (req.user&& questions.length > 0){
                              answerlist = questions.map(function(a){                              if (a.answers.length > 0){
                                      return a.answers[0]._id + ""
                                  }
                                  return "0"
                              })
                              userlikes = await rediscmd.answerlike_hmget(req.user._id,answerlist)
                          }

                          return res.json({questions,userlikes})
                      })

    }



}

function listanswer(req, res) {


    var question  = keystone.list( "Question" )

    var l = 10
    var s = 0
    var questionid = req.query.questionid

    if (!questionid) {
        return res.json({code:-1,message:"no questionid"})
    }

    if (req.query.limit){
      l = req.query.limit
    }

    l = parseInt(l)

    if (req.query.skip){
      s = req.query.skip
    }
    s = parseInt(s)


      question.model.findOne({_id:questionid})
                    .skip(s)
                    .limit(l)
                    .populate({ path: 'answers',
                        options: {sort: {'updateTime':-1},
                        limit: 20},
                        populate: {path: 'author',select: {'name':1,'avatar':1}}
                    })
                    .exec(async function (err, question) {
                        if (err) return res.json(err);
                        var userlikes = []
                        if (req.user){
                            answerlist = question.answers.map(a => a._id+"")
                            userlikes = await rediscmd.answerlike_hmget(req.user._id,answerlist)

                        }

                        return res.json({question,userlikes})
                    })

}


function updateQuesionbyNewAnswer(req,res,answer,callback){
    var question  = keystone.list( "Question" )
    var updateDocument = {
        $inc:{"answerCount":1},
        updateTime: new Date(),
        $push:{"answers":answer},
    }
    question.model.findOneAndUpdate({_id:answer.question},updateDocument,{},function(err, updatedObject){
            if (err){
                return res.json({code:-1,message:"update question err"})
            }

            callback()
    })
}

module.exports = {
	create:create,
    list:list,
    listanswer:listanswer,
    updateQuesionbyNewAnswer:updateQuesionbyNewAnswer
}
