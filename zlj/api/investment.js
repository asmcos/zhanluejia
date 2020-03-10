
var keystone = require('keystone')






function list(req,res){
    var investment  = keystone.list( "Investment" )

    var l = 10
    var s = 0
    var sort = '-createTime'
    if (req.query.limit){
      l = req.query.limit
    }

    l = parseInt(l)

    if (req.query.skip){
      s = req.query.skip
    }
    s = parseInt(s)

    if (req.query.sort){
        sort = req.query.sort
    }

    investment.model.find({status:1})
                .skip(s)
                .limit(l)
                .sort(sort)
                .exec(async function (err, investments) {
                    if (err) return res.json(err);

                    return res.json({investments})
                })

}



module.exports = {

    list:list,

}
