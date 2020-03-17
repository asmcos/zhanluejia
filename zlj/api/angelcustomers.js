
var keystone = require('keystone')
const child = require('child_process')


//

function createdy(req, res) {

	var content = req.body.content
	var eventType = req.body.eventType

	cmd = 'python3 ./dy.py "' + content +'" ' + eventType


	child.exec(cmd, function(err, result) {

    	ret = result.split("\n")
		console.log(ret)
		if (eventType == "1"){
			return res.json({code:0,message:"ok",data:{name:ret[0],uid:ret[1]}})
		} else{
			return res.json({code:0,message:"ok",data:{name:ret[0],itemId:ret[1]}})
		}

	})
}



module.exports = {
	createdy:createdy,
}
