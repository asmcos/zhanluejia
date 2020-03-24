/*
 * 这是一个weixin公众号弹朋友功能
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Tanpengyou = new keystone.List('Tanpengyou',{
	defaultSort: '-id'
	});

Tanpengyou.add({
  author:{type: Types.Relationship, ref: 'User' }, //发起人
  createTime: { type: Types.Datetime,default: Date.now }, //入库时间
  isTop: { type:Types.Number,default:0}, //0,未置顶, 1,置顶且排序靠后，2,置顶且排序优先于1
  qrcode: {type:Types.Text}, //网址
  platform:{type:Types.Number,default:3},//1 抖音，2快手，3微信，4微博。。。
  status: {type: Number,default:1} //1 正常，0 删除
});



Tanpengyou.defaultColumns = 'author,platform';
Tanpengyou.register();


//exchange 交易记录
var Tanpengyouex= new keystone.List('Tanpengyouex',{
	defaultSort: '-id'
	});

Tanpengyouex.add({
  tanpengyou:{type: Types.Relationship, ref: 'Tanpengyou'}, //弹出的人
  author:{type: Types.Relationship, ref: 'User' }, //发起人
  createTime: { type: Types.Datetime,default: Date.now }, //入库时间
  platform:{type:Types.Number,default:3},//1 抖音，2快手，3微信，4微博。。。
  status: {type: Number,default:1} //1 正常，0 删除
});


Tanpengyouex.defaultColumns = 'author';
Tanpengyouex.register();
