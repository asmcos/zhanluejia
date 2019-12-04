/*
 * The is answer model of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Answer = new keystone.List('Answer',{
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


Answer.add({
  question: { type: Types.Relationship, ref: 'Question' },
  content:  { type: Types.Html, wysiwyg: true },
  thumbnail: { type:Types.Text }, //image address
  createTime: { type: Types.Date },
  updateTime: { type: Types.Date }, //最后回答的时间
  tags: {type :Types.Text },
  author: { type: Types.Relationship, ref: 'User' },
  hidenStatus: { type: Types.Number },
  commentCount: { type: Types.Number }, //评论数
  likecount: { type:Types.Number } ,//点赞数
});

Answer.schema.pre('save', function (next) {
  return next();
});

Answer.defaultColumns = 'content';
Answer.register();
