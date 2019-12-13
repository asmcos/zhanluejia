
var keystone = require('keystone')


function uploadimage (req, res) {


      var images = keystone.list( "Imageupload" ) //Imageupload
      item = images.model()


      // ckeditor ajax is "upload", but Imageupload model fields is "image"
      //req.files.image = req.files.upload

      images.updateItem(item,req.body,{files:req.files},function(err){
          if (err){
              return res.json({code:'-1',message:"upload file error"})
          }

          data = images.getData(item)
          filename = '/static/uploads/' + data.fields.image.filename

          // return for ctrl+v , clipboard
          if (req.query['responseType'] == 'json'){
                //return res.json({"fileName":"image.png","uploaded":1,"url":filename})
                return res.json({"errno": 0,"data": [
                    filename
                ]})
          } else {
            // return for upload file by form submit
            res.setHeader('Content-Type', 'text/html');
                res.end('<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction("0", "'+filename+'", "");</script>')
          }
      })


}


module.exports = {
	uploadimage:uploadimage
}
