/*
 * The is an example of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Imageupload = new keystone.List('Imageupload',{
	defaultSort: '-id'
	});


var storage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: 'public/uploads',
        publicPath: '/static/uploads/',
		generateFilename: (file) => {
			const ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
			return `${file.filename}.${ext}`;
		}
    }
});


Imageupload.add({
  image: { type: Types.File, storage: storage, collapse:"image" },
  dateTime:{ type: Types.Datetime, default: Date.now } ,
});

Imageupload.defaultColumns = 'image';
Imageupload.register();


