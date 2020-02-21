
var keystone = require('keystone');


keystone.init({
  'cookie secret': 'zhanluejia is Zhan!',
  'name': 'zhanluejia', // This will also be the name of your database in MongoDB.
  'auth': true,
  'user model': 'User',
  'auto update': true,
});


var wxapi = require('./wxmp/wxapi');
global.wxapi = wxapi.wxapi
global.mpapi = wxapi.mpapi


var redis = require('./redis/index');
global.redis = redis.redis

keystone.set("signin logo","/static/img/logo.jpg")

keystone.set('port',3090);

// Load your project's Models
// load ./models/*.js
keystone.import('models');

// routes
keystone.set('routes', require('./routes'));

keystone.start();
