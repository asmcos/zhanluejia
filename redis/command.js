const {promisify} = require('util');

const hgetAsync = promisify(redis.hget).bind(redis);
const hmgetAsync = promisify(redis.hmget).bind(redis);


/*
    answerlike:"Answerlike" + userid (hash)| answerid (field)= like status 0 or 1
*/
function answerlike_hset(userid,answerid){
    var hash = "Answerlike"+userid
    var field = answerid

    redis.hget(hash,field,function(err,liked){

        if (liked != 1 ){
            redis.hset(hash,field,1)
        } else {
            redis.hset(hash,field,0)
        }
    })

}

async function answerlike_hget(userid,answerid){
    var hash = "Answerlike"+userid
    var field = answerid


    var liked = await hgetAsync(hash,field)

    return liked
}

async function answerlike_hmget(userid,answeridlist){
    var hash = "Answerlike"+userid
    var field = answeridlist

    var liked = await hmgetAsync(hash,field)

    return liked
}

exports = module.exports={
    answerlike_hset:answerlike_hset,
    answerlike_hget:answerlike_hget,
    answerlike_hmget:answerlike_hmget,
}
/*test*/
/*answerlike_hset (432,678)
var likestatus = await answerlike_hget (req.user._id,answerid)
await answerlike_hget (432,678)

answerlike_hmget (432,[678,321]).then((liked)=> {
    console.log(liked);
})
*/
