var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Score Model  用户积分事件体系
 * ==========
 */
var Score = new keystone.List('Score');

Score.add({
  	author: { type: Types.Relationship, ref: 'User' }, //积分人
  	user: { type: Types.Relationship, ref: 'User' },  //事件发起人
  	eventType: {type:Types.Number}, //1 发提问，2 回答 3 点赞 （对回答的）4， 评论 5 转发
	ObjID: {type:String},  //id number
	score: {type:Types.Number},    //单次事件分数
	total: {type:Types.Number},    //累计积分
	createTime: { type: Types.Datetime, default: Date.now},

});



/**
 * Registration
 */
Score.defaultColumns = 'total';
Score.register();
