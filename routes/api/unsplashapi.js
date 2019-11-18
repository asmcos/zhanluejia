const fetch = require('node-fetch');
global.fetch = fetch
const Unsplash = require('unsplash-js').default;
const toJson = require("unsplash-js").toJson

const unsplash = new Unsplash({
  applicationId: "8672af113b0a8573edae3aa3713886265d9bb741d707f6c01a486cde8c278980",
});


exports = module.exports = function (req, res) {
	unsplash.photos.listPhotos(2, 15, "latest")
  		.then(toJson)
  		.then(json => {
    		// Your code
	 		res.json(json)
  		});
}


exports.search = module.exports.search = function(req,res){

	// results-->urls--->regular

	var words = req.query.search
	
	unsplash.search.photos(words, 1)
  		.then(toJson)
  		.then(json => {
    		res.json(json)
  	});
}
