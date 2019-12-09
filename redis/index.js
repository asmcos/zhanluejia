var Redis = require('redis');


var redis = Redis.createClient()




redis.on("error", function (err) {
    console.log("Error " + err);
});

redis.on("connect",function(err){
    console.log("redis connected")
})

exports.redis = module.exports.redis = redis
