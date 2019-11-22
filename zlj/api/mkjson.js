var fs = require('fs');
var path = require('path')


function getimglist (pa) {
	var files = fs.readdirSync(pa)

	var imglist = []
	files.forEach(function(file,index){
		var ext = path.extname(file)
		if (ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".bmp" || ext == ".svg"){
			imglist.push(file)
		}
	})
	return imglist
}

exports.getImgList = module.exports.getImgList = getimglist
