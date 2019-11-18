/*
 * The is an example of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Blog = new keystone.List('Blog');


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


Blog.add({
  title: { type: Types.Text, required: true, initial: true,label:"标题"},
  dateTime:{ type: Types.Datetime, default: Date.now } ,
  html:{ type: Types.Html, wysiwyg: true },
  bgimg:{ type: Types.Url, label:"背景图片",collapse:"unsplashimg"},
  published: { type: Boolean ,label:"发布"},
});

Blog.schema.pre('save', function (next) {
  return next();
});

Blog.defaultColumns = 'title';
Blog.register();


