var keystone = require('keystone')
var swig  = require('swig');
var async = require('async');
var HandleRobot = require('./ssr').HandleRobot

var temppath = __dirname +  "/../templates/"

swig.setDefaults({ cache: false,varControls: ['<%=', '%>'] });

function getsysconf(data,cb){

	var Sysconf = keystone.list( "Sysconf" )

	Sysconf.model.find().exec(function(err,result){
		var convertdata = {}

		result.forEach(function(conf){
			convertdata[conf.confkey] = conf.confval
		})

		data.sysconf = convertdata

		var d = new Date()
		data.sysconf.year = d.getFullYear()

		cb(null,"sysconf")
	})
}

function seoquestion(req,data ,cb){
	var question = keystone.list( "Question" )

	question.model.findOne({status:1,_id:req.query.questionid})
	.select("title content")
	.exec(function(err,result){

		data.question = result
		console.log(data.question)
		cb(null,"seoquestion")
	})
}
function seoquestions(data ,cb){

	var questions = keystone.list( "Question" )

	questions.model.find({status:1})
	.limit(10)
	.select("title")
	.sort('-_id')
	.exec(function(err,result){

		data.questions = result

		cb(null,"seoquestions")
	})
}


function seoanswer(data,cb){

}
function seoanswers(data,cb){

}
function getData(req,res,data,tasklist,setData) {


	if (req.user && req.user.isAdmin != true){
		var user = {
			id:req.user._id+"",
			name:req.user.name.first,
			avatar:req.user.avatar
		}

		data.user = user
	}
    async.parallel(tasklist,
    function(err,results){
        setData(data)
    })
}

async function index (req,res){

	if (await HandleRobot(req,res) == 1){
		return
	}

	var tasklist = [

        function(callback){
            getsysconf(data,callback);
        },
		function(callback){
			seoquestions(data,callback);
		}
    ]

	var data = {}

    getData(req,res,data,tasklist,function(data){

        var content =  swig.renderFile(temppath + 'index.html',
            data
        );

        res.send(content)
    })

}

async function gather (req,res){
	
	if (await HandleRobot(req,res) == 1){
		return
	}

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]
	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'gather.html',
            data
        );

        res.send(content)
    })

}


function my (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]
	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'my.html',
            data
        );

        res.send(content)
    })
}


function newquestion (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]
	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'newquestion.html',
            data
        );

        res.send(content)
    })
}

async function answer (req,res){

	if (await HandleRobot(req,res) == 1){
		return
	}

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]
	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'answer.html',
            data
        );

        res.send(content)
    })
}

function updateanswer (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]
	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'updateanswer.html',
            data
        );

        res.send(content)
    })
}

async function question (req,res){

	if (await HandleRobot(req,res) == 1){
		return
	}
	var tasklist = [

		function(callback){
			seoquestion(req,data,callback);
		},
		function(callback){
			getsysconf(data,callback);
		},

	]
	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'question.html',
            data
        );

        res.send(content)
    })
}

async function answers (req,res){

	if (await HandleRobot(req,res) == 1){
		return
	}

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'answers.html',
            data
        );

        res.send(content)
    })
}

async function investments (req,res){
	if (await HandleRobot(req,res) == 1){
		return
	}

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'investments.html',
            data
        );

        res.send(content)
    })
}

function newpe (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'newpe.html',
            data
        );

        res.send(content)
    })
}

function pushevents (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'pushevents.html',
            data
        );

        res.send(content)
    })
}

function pushevent (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'pushevent.html',
            data
        );

        res.send(content)
    })
}

function mypusheventexs (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'mypusheventexs.html',
            data
        );

        res.send(content)
    })
}

function mypushdone (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'mypushdone.html',
            data
        );

        res.send(content)
    })
}

function pusheventexs (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'pusheventexs.html',
            data
        );

        res.send(content)
    })
}

function search (req,res){

	var tasklist = [

		function(callback){
			getsysconf(data,callback);
		},

	]

	var data = {}

    getData(req,res,data,tasklist,function(data){
        var content =  swig.renderFile(temppath + 'search.html',
            data
        );

        res.send(content)
    })
}

exports = module.exports={
    index:index,
    my:my,
    newquestion:newquestion,
	question:question,
    answer:answer, //q and a
	updateanswer:updateanswer, //编辑回答
	answers:answers, //all answers
	gather:gather,
	investments:investments,
	newpe:newpe,
	pushevents:pushevents,
	pushevent:pushevent,
	mypusheventexs:mypusheventexs,
	mypushdone:mypushdone,
	pusheventexs:pusheventexs,
	search:search,
}
