var keystone = require('keystone');
var Types = keystone.Field.Types;

var Menu = new keystone.List('Menu');

Menu.add({
  title: { type: String, required: true, initial: true,label:"菜单名称"},
  url: { type: Types.Url,label:"跳转地址"},
  type: { type: Types.Select, options: [{ value: "1", label: '数据库' }, { value: "2", label: '网址' }],label:"菜单类型" }, // 1:url = model.name ,2:url=/xxx/xxx/...
  level: { type: Types.Select, options: [{ value: "1", label: '一级' }, { value: "2", label: '二级' }] }, //0:main,1:submenu
  icon: {type: String,label:"图标"},
  hiden: { type: Boolean },

});

Menu.schema.pre('save', function (next) {
  return next();
});

Menu.defaultColumns = 'title,type,url,level';
Menu.register();


