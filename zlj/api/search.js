
var keystone = require('keystone')





async function search(req, res) {


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

    var keyword = req.query.keyword
    keyword = decodeURI(escape(keyword))
    var starttime = new Date()

    if (req.query.starttime){
      starttime = new Date(req.query.starttime)
    }


    var  filter =  [{title: {$regex: keyword}}]

    question.model.find({status:1,updateTime:{$lt:starttime},
                        $or:filter})
                      .skip(s)
                      .limit(l)
                      .sort('-updateTime')
                      .populate({ path: 'answers',
                          options: {sort: {'likeCount':-1},
                          limit: 1,status:1},
                          match: { status: 1 },
                          populate: {path: 'author', select: {'name':1,'avatar':1}}
                      })
                      .exec(async function (err, questions) {
                          if (err) return res.json(err);

                          return res.json({questions})
                      })





}





module.exports = {

    search:search,

}
