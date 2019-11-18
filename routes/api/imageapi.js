var keystone = require('keystone');
var async = require('async'); 



function getImage(data,cb){

	var Image = keystone.list( "Imageupload" )
	Image.model.find().sort("-_id").exec(function(err,result){
		data.img = result
		cb(null,"image")
	})
}

exports = module.exports = function (req, res) {

	var data = {}

	async.parallel([
		function(callback){
			getImage(data,callback);
		},
	],
	function(err,results){
		res.json(data)
	})

};

