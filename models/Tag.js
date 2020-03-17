var keystone = require('keystone');
var mongoose = require('mongoose');

var Types = keystone.Field.Types;

var Tag = new keystone.List('Tag');

Tag.add({
  name: { type: String, required: true, initial: true,label:"名字"},
  type: { type: String,label:"类型"}, //1.question 2.answer ,3 user
  status: {type: Number,default:1} //1 正常，0 删除
});

Tag.schema.pre('save', function (next) {
  return next();
});

Tag.defaultColumns = 'name';
Tag.register();
