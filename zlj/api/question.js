
var keystone = require('keystone')


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

function list(req, res) {


    var question  = keystone.list( "Question" )

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


      question.model.find()
                    .skip(s)
                    .limit(l)
                    .sort('-updateTime')
                    .exec(function (err, questions) {
                        if (err) return res.json(err);
                        res.json(questions)
                    })

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
                        options: {sort: {'updateTime':-1}},
                    })
                    .exec(function (err, questions) {
                        if (err) return res.json(err);
                        res.json(questions)
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
