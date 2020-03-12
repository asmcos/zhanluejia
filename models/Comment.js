/*
 * The is answer model of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Comment = new keystone.List('Comment',{
	defaultSort: '-id'
	});

Comment.add({
  Answer: { type: Types.Relationship, ref: 'Answer' },
  content:  { type: Types.Text },
  createTime: { type: Types.Datetime,default: Date.now },
  author: { type: Types.Relationship, ref: 'User' },
  hidenStatus: { type: Types.Number },
  likeCount: { type:Types.Number,default:0 } ,//点赞数
  liked:{ type:Types.Relationship,ref: 'Commentlike' },
  status: {type: Number,default:1} //1 正常，0 删除
});

Comment.schema.pre('save', function (next) {
  return next();
});

Comment.defaultColumns = 'content';
Comment.register();


var Commentlike = new keystone.List('Commentlike')
Commentlike.add({
	user: { type: Types.Relationship, ref: 'User' },
	createTime: { type: Types.Datetime, default: Date.now },
	comment: { type: Types.Relationship, ref: 'Comment' },
	status: {type:Types.Number,default:0}, //1 点赞， -1，取消
})
Commentlike.register();
