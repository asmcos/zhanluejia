
var keystone = require('keystone')
var answer = require('./answer')
var rediscmd =  require('../../redis/command')

updateAnswerbyNewComment = answer.updateAnswerbyNewComment


function create(req, res) {


      var comment  = keystone.list( "Comment" )

      if (!req.user){
          return res.json({code:-1,message:"Your need login"})
      }



      var item = comment.model()


      item.createTime = new Date()

      comment.updateItem(item,req.body,{},function(err){
          if (err){
              return res.json({code:'-1',message:"save answer error"})
          }

          if (req.user){
              item.author = req.user
              item.save(function (err) {
                  if (err) return res.json(err);
                  updateAnswerbyNewComment(req,res,item,function(){
                      return res.json({code:0,message:"success"})
                  })
              })

          }


      })


}


async function like(req, res) {

    if (!req.query.commentid){
        return res.json({code:-1,message:"no commentid "})
    }

    if (!req.user){
        return res.json({code:-1,message:"no user "})
    }

    var commentid = req.query.commentid




    var comment  = keystone.list( "Comment" )
    var like  = keystone.list( "Commentlike" )
    var count = 1 ;

    //likestatus == 1的时候，count = -1 ,也就是取消点赞
    //likestatus == null，或者 0的时候 +1,也就是点赞
    var likestatus = await rediscmd.commentlike_hget (req.user._id,comment+"")


    if( likestatus == 1){
        count = -1
        likestatus = -1
    } else {
        likestatus = 1
    }

    var updateDocument = {
        $inc:{"likeCount":count},
    }

    rediscmd.commentlike_hset(req.user._id,commentid+"")

    comment.model.findOneAndUpdate({_id:commentid},updateDocument,{returnNewDocument:true,new:true},function(err, updatedObject){


            if (err){
                return res.json({code:-1,message:"update comment err"})
            }

            var l = new like.model({user:req.user,comment:commentid,status:likestatus})

            l.save(function(err){
                return res.json({code:0,message:"like ok",updatedObject})
            })
    })

}


module.exports = {
	create:create,
    like:like,

}
