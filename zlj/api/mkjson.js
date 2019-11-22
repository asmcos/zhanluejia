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

function getNick (){
	var nickdata = fs.readFileSync(__dirname+"/nickname.json")
	
	return 	JSON.parse(nickdata).name

}
exports.getImgList = module.exports.getImgList = getimglist
exports.getNick = module.exports.getNick = getNick
