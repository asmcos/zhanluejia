/*
 * The is question model of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Question = new keystone.List('Question',{
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


Question.add({
  title: { type: Types.Text, required: true, initial: true,label:"标题"},
  thumbnail: { type:Types.Text }, //image address
  content:  { type: Types.Html, wysiwyg: true },
  type:  { type: Types.Text}, //提问，知识，心得，辩论
  createTime: { type: Types.Date },
  updateTime: { type: Types.Date }, //最后回答的时间
  answerCount: { type: Types.Number,default:0 }, //回答的数目
  tags: {type: Types.Relationship, ref: 'Tag' ,many: true},
  author: { type: Types.Relationship, ref: 'User' },
  hidenStatus: { type: Types.Number ,default:0}, //0.正常开放,1.隐藏
  isTop: { type:Types.Number,default:0}, //0,未置顶, 1,置顶且排序靠后，2,置顶且排序优先于1
  answers: {type: Types.Relationship, ref: 'Answer' ,many: true},
  pageviews: {type:Number,default:0}, //浏览量
  status: {type: Number,default:1} //1 正常，0 删除

});

Question.schema.pre('save', function (next) {
  return next();
});

Question.defaultColumns = 'title';
Question.register();
