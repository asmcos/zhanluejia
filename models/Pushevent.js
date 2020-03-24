/*
 * 这是一个粉丝互推，关注，点赞的库，包含需求和记录
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Pushevent = new keystone.List('Pushevent',{
	defaultSort: '-id'
	});

Pushevent.add({
  author:{type: Types.Relationship, ref: 'User' }, //发起人
  createTime: { type: Types.Datetime,default: Date.now }, //入库时间
  isTop: { type:Types.Number,default:0}, //0,未置顶, 1,置顶且排序靠后，2,置顶且排序优先于1
  platform:{ type:Types.Number,default:1}, //1 抖音，2快手，3微信，4微博。。。
  eventType:{ type:Types.Number,default:1}, //1 关注，2.视频点赞 3. 评论
  nickname: {type:Types.Text}, // 相关平台的昵称
  eventId:{type:Types.Text}, //userid,videoid....
  status: {type: Number,default:1} //1 正常，0 删除
});



Pushevent.defaultColumns = 'author,platform';
Pushevent.register();


//exchange 交易记录
var Pusheventex= new keystone.List('Pusheventex',{
	defaultSort: '-id'
	});

Pusheventex.add({
  pushevent:{type: Types.Relationship, ref: 'Pushevent'}, //
  author:{type: Types.Relationship, ref: 'User' }, //发起人
  nickname:{type:Types.Text}, //author在同平台昵称 ,
  //显示操作者和被操作者在同一个平台的昵称，被操作者的昵称 通过pushevent可以查找
  //同平台指， 抖音，快手，微信等
  targetUser:{type: Types.Relationship, ref: 'User' },//被关注，点赞的在本平台账号
  createTime: { type: Types.Datetime,default: Date.now }, //入库时间
  confirm:{type:Types.Number,default:0}, //0 发生，未确认， 1确认
  confTime: { type: Types.Datetime}, //确认时间 确认人应该是Pushevent.author
  status: {type: Number,default:1} //1 正常，0 删除
});


Pusheventex.defaultColumns = 'author';
Pusheventex.register();


//目前未使用
//用户在平台的信息
var Uplatform= new keystone.List('UPlatform',{
	defaultSort: '-id'
	});

Uplatform.add({
  author:{type: Types.Relationship, ref: 'User' }, //发起人
  nickname:{type:Types.Text}, //author在同平台昵称 ,
  createTime: { type: Types.Datetime,default: Date.now }, //入库时间
  updateTime: { type: Types.Datetime,default: Date.now }, //更新时间
  platform:{ type:Types.Number,default:1}, //1 抖音，2快手，3微信，4微博。。。
  nickname: {type:Types.Text}, // 相关平台的昵称
  platformId:{type:Types.Text}, //userid
  status: {type: Number,default:1} //1 正常，0 删除
});


Uplatform.defaultColumns = 'author';
Uplatform.register();
