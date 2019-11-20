/*
 * The is an Captcha of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Smscode = new keystone.List('Smscode',{
	defaultSort: '-id'
	});



Smscode.add({
  phone: { type: Types.Text, required: true, initial: true,label:"手机号码"},
  code: { type: Types.Text, required: true, initial: true,label:"code"},
  dateTime:{ type: Types.Datetime, default: Date.now } ,
  times:{ type:Types.Number,default:0 } //同一个ID验证的次数，程序校验三次以后禁止校验
});

Smscode.schema.pre('save', function (next) {
  return next();
});

Smscode.defaultColumns = "phone,code"
Smscode.register();


