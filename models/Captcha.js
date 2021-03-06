/*
 * The is an Captcha of  most keystone fields .
 *
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Captcha = new keystone.List('Captcha',{
	defaultSort: '-id'
	});



Captcha.add({
  result: { type: Types.Text, required: true, initial: true,label:"结果"},
  dateTime:{ type: Types.Datetime, default: Date.now } ,
  times:{ type:Types.Number,default:0 } //同一个ID验证的次数，程序校验三次以后禁止校验
});

Captcha.schema.pre('save', function (next) {
  return next();
});

Captcha.defaultColumns = "result"
Captcha.register();


