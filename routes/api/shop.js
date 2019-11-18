var keystone = require('keystone');
var async = require('async'); 



function getShop(data,cb){

	var Shop = keystone.list( "Shop" )
	Shop.model.find().sort("-_id").exec(function(err,result){
		data.shop = result
		cb(null,"shop")
	})
}

exports = module.exports = function (req, res) {

	var data = {}

	async.parallel([
		function(callback){
			getShop(data,callback);
		},
	],
	function(err,results){
		res.json(data)
	})

};

