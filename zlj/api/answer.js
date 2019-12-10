
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


module.exports = {
	create:create,
    like:like,

}
