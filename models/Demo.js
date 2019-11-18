/*
 * The is an example of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Demo = new keystone.List('Demo',{
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


Demo.add({
  title: { type: Types.Text, required: true, initial: true,label:"标题"},
  url: { type: Types.Url},
  level: { type: Number, default: 0},
  hiden: { type: Boolean },
  email:{ type:Types.Email },
  password:{ type:Types.Password } ,
  uploadfile: { type: Types.File, storage: storage },
  startTime:{ type: Types.Date },
  dateTime:{ type: Types.Datetime, default: Date.now } ,
  color:{ type: Types.Color },
  html:{ type: Types.Html, wysiwyg: true },
  content: { type:Types.Textarea} ,
  html2:{ type: Types.Html, wysiwyg: true },
  select:{ type: Types.Select, options: 'first, second, third' },
});

Demo.schema.pre('save', function (next) {
  return next();
});

Demo.defaultColumns = 'title,url,level';
Demo.register();


