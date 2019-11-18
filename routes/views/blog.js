var keystone = require('keystone');
var async = require('async'); 


function getsysconf(data,cb){

	var Sysconf = keystone.list( "Sysconf" )

	Sysconf.model.find().exec(function(err,result){
		var convertdata = {}	
		
		result.forEach(function(conf){
			convertdata[conf.confkey] = conf.confval
		})

		data.sysconf = convertdata
		cb(null,"sysconf")
	})
}

function getBlogId(id,data,cb){

	var Blog = keystone.list( "Blog" )

	  Blog.model.findOne({'_id':id}).exec(function(err,result){

		data.blog = result
		cb(null,"blog")
	 })
}

function getPrevBlogId(id,data,cb){

    var Blog = keystone.list( "Blog" )

      Blog.model.find({ '_id': { '$lt': id } }).sort({_id: -1}).limit(1).exec(function(err,result){
		if (result.length > 0){        
        	data.prevblog = result[0]
		}
        cb(null,"prevblog")
     })
}


function getNextBlogId(id,data,cb){

    var Blog = keystone.list( "Blog" )

        
      Blog.model.find( {'_id': { '$gt': id } }).sort({_id: 1}).limit(1).exec(function(err,result){
		if (result.length > 0){        
        	data.nextblog = result[0]
		}
        cb(null,"nextblog")
     })
}


exports = module.exports = function (req, res) {

	var data = {}


	var id = req.query.id

	if (!id){
		res.json(data)
	}

	data.prevblog={}
	data.nextblog={}
	async.parallel([
		function(callback){
			getBlogId(id,data,callback);
		},
		function(callback){
			getPrevBlogId(id,data,callback);
		},
		function(callback){
			getNextBlogId(id,data,callback);
		},
		function(callback){
			getsysconf(data,callback);
		},
	],
	function(err,results){
		res.json(data)
	})

};

