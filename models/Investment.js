/*
 * The is investment model of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Investment = new keystone.List('Investment',{
	defaultSort: '-id'
	});




Investment.add({
  company: { type: Types.Text, required: true, initial: true,label:"公司名称"},
  eventDate: {type:Types.Date}, //融资时间
  money:{type: Types.Text}, //价格
  unit:{type:Types.Number,default:1},//1 RMB,2 Dollar
  round:{type:Types.Text}, //pre-A,A,B 轮次
  capital:{type:Types.Text}, //投资方
  industry:{type:Types.Text}, //行业，类别
  createTime: { type: Types.Datetime,default: Date.now }, //入库时间
  isTop: { type:Types.Number,default:0}, //0,未置顶, 1,置顶且排序靠后，2,置顶且排序优先于1
  pageviews: {type:Number,default:0}, //浏览量
  status: {type: Number,default:1} //1 正常，0 删除
});



Investment.defaultColumns = 'company';
Investment.register();
