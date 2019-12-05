
var keystone = require('keystone')
var question = require('./question')

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

      //item.question = req.body.questionid

      answer.updateItem(item,req.body,{},function(err){
          if (err){
              return res.json({code:'-1',message:"save answer error"})
          }

          updateQuesionbyNewAnswer(req,res,item,function(){
              return res.json({code:0,message:"success"})
          })

      })


}


module.exports = {
	create:create
}
