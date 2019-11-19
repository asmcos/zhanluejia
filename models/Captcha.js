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
});

Captcha.schema.pre('save', function (next) {
  return next();
});

Captcha.defaultColumns = "result"
Captcha.register();


