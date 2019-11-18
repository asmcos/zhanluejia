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

function getBlog(data,cb){

	var Blog = keystone.list( "Blog" )
	Blog.model.find().sort("-_id").exec(function(err,result){

		data.blog = result
		cb(null,"blog")
	})
}

exports = module.exports = function (req, res) {

	var data = {}

	async.parallel([
		function(callback){
			getBlog(data,callback);
		},
		function(callback){
			getsysconf(data,callback);
		},
	],
	function(err,results){
		res.json(data)
	})

};

