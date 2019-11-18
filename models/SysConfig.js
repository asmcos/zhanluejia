var keystone = require('keystone');
var Types = keystone.Field.Types;

var Sysconf = new keystone.List('Sysconf');

Sysconf.add({
  confkey: { type: String, required: true, initial: true, label:"名称"},
  confval: { type: String, required: true, initial: true, label:"值"},
  state: { type:Boolean, default:true}
});

Sysconf.schema.pre('save', function (next) {
  return next();
});

Sysconf.defaultColumns = 'confkey,confval';
Sysconf.register();


