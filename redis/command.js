const {promisify} = require('util');

const hgetAsync = promisify(redis.hget).bind(redis);
const hmgetAsync = promisify(redis.hmget).bind(redis);


/*
    answerlike:"Answerlike" + userid (hash)| answerid (field)= like status 0 or 1
    commentlike:"Commentlike" + userid (hash)| answerid (field)= like status 0 or 1
    pushevent:"Pushevent" + userid(hash) |pusheventid(field) = done status 0 or 1
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



function commentlike_hset(userid,commentid){
    var hash = "Commentlike"+userid
    var field = commentid

    redis.hget(hash,field,function(err,liked){

        if (liked != 1 ){
            redis.hset(hash,field,1)
        } else {
            redis.hset(hash,field,0)
        }
    })

}

async function commentlike_hget(userid,commentid){
    var hash = "Commentlike"+userid
    var field = commentid


    var liked = await hgetAsync(hash,field)

    return liked
}

async function commentlike_hmget(userid,commentidlist){
    var hash = "Commentlike"+userid
    var field = commentidlist

    var liked = await hmgetAsync(hash,field)

    return liked
}

// 0 表示 已经提交
// 1 表示 对方已经确认
function pushevent_hset(userid,pusheventid,value){
    var hash = "Pushevent"+userid
    var field = pusheventid
    
    redis.hset(hash,field,value)

}

async function pushevent_hget(userid,pusheventid){
    var hash = "Pushevent"+userid
    var field = pusheventid

    var confirm = await hgetAsync(hash,field)

    return confirm
}

async function pushevent_hmget(userid,pusheventidlist){
    var hash = "Pushevent"+userid
    var field = pusheventidlist

    var confirm = await hmgetAsync(hash,field)

    return confirm
}

exports = module.exports={
    answerlike_hset:answerlike_hset,
    answerlike_hget:answerlike_hget,
    answerlike_hmget:answerlike_hmget,
    commentlike_hset:commentlike_hset,
    commentlike_hget:commentlike_hget,
    commentlike_hmget:commentlike_hmget,
    pushevent_hset:pushevent_hset,
    pushevent_hget:pushevent_hget,
    pushevent_hmget:pushevent_hmget,
}
/*test*/
/*answerlike_hset (432,678)
var likestatus = await answerlike_hget (req.user._id,answerid)
await answerlike_hget (432,678)

answerlike_hmget (432,[678,321]).then((liked)=> {
    console.log(liked);
})
*/
