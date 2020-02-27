
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

function del(req, res) {


    if (!req.user){
        return res.json({code:-1,message:"Your need login"})
    }



      var question  = keystone.list( "Question" )

      var questionid = req.query.questionid


      var item = question.model()

      var authorid = req.user._id

      //0 删除，1正常

      question.model.findOneAndUpdate({_id:questionid,author:authorid},{status:0},{},function(err, updatedObject){
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

        question.model.find({status:1})
                      .skip(s)
                      .limit(l)
                      .populate('tags')
                      .where('tags').in([tagid])
                      .sort('-updateTime')
                      .populate({ path: 'answers',
                          options: {sort: {'likeCount':-1},
                          limit: 1,status:1},
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
        question.model.find({status:1})
                      .skip(s)
                      .limit(l)
                      .sort('-updateTime')
                      .populate({ path: 'answers',
                          options: {sort: {'likeCount':-1},
                          limit: 1,status:1},
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

async function myquestions(req, res) {


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

    if (!req.user){
        return res.json({code:-1,message:"账号异常"})
    }

    var userid = req.user._id

    if (tagname){
        tagname = decodeURI(tagname)
        var tagid = await tag.model.findOne({name:tagname})

        // 查找的 标签 不存在
        if (!tagid){
            return res.json({questions:[],userlikes:[]})
        }

        question.model.find({author:userid,status:1})
                      .skip(s)
                      .limit(l)
                      .populate('tags')
                      .where('tags').in([tagid])
                      .sort('-updateTime')
                      .populate({ path: 'answers',
                          options: {sort: {'likeCount':-1},
                          limit: 1,status:1},
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
        question.model.find({author:userid,status:1})
                      .skip(s)
                      .limit(l)
                      .sort('-updateTime')
                      .populate({ path: 'answers',
                          options: {sort: {'likeCount':-1},
                          limit: 1,status:1},
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

async function listanswer(req, res) {


    var question  = keystone.list( "Question" )

    var questionid = req.query.questionid

    if (!questionid) {
        return res.json({code:-1,message:"no questionid"})
    }

    await question.model.updateOne({_id:questionid,status:1}, {$inc: {pageviews:1}});

    question.model.findOne({_id:questionid,status:1})
                    .populate({ path: 'answers',
                        options: {sort: {'updateTime':-1},
                        limit: 20,status:1},
                        populate: {path: 'author',select: {'name':1,'avatar':1}}
                    })
                    .exec(async function (err, questionDoc) {
                        if (err) return res.json(err);

                        var userlikes = []
                        if (req.user&&questionDoc.answers.length>0){
                            answerlist = questionDoc.answers.map(a => a._id+"")
                            userlikes = await rediscmd.answerlike_hmget(req.user._id,answerlist)

                        }

                        return res.json({question:questionDoc,userlikes})
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
    del:del,
    listanswer:listanswer,
    myquestions:myquestions,
    updateQuesionbyNewAnswer:updateQuesionbyNewAnswer
}
