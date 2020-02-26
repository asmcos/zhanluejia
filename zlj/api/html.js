var keystone = require('keystone')
var swig  = require('swig');
var async = require('async');




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

function getData(req,res,setData) {
    var data = {

	}
	if (req.user){
		var user = {
			id:req.user._id+"",
			name:req.user.name.first,
			avatar:req.user.avatar
		}

		data.user = user
	}
    async.parallel([

        function(callback){
            getsysconf(data,callback);
        },
    ],
    function(err,results){
        setData(data)
    })
}

function index (req,res){

    getData(req,res,function(data){

        var content =  swig.renderFile(temppath + 'index.html',
            data
        );

        res.send(content)
    })

}

function gather (req,res){

    getData(req,res,function(data){
        var content =  swig.renderFile(temppath + 'gather.html',
            data
        );

        res.send(content)
    })

}


function my (req,res){


	getData(req,res,function(data){
        var content =  swig.renderFile(temppath + 'my.html',
            data
        );

        res.send(content)
    })
}


function newquestion (req,res){


	getData(req,res,function(data){
        var content =  swig.renderFile(temppath + 'newquestion.html',
            data
        );

        res.send(content)
    })
}

function answer (req,res){


	getData(req,res,function(data){
        var content =  swig.renderFile(temppath + 'answer.html',
            data
        );

        res.send(content)
    })
}

function question (req,res){

	getData(req,res,function(data){
        var content =  swig.renderFile(temppath + 'question.html',
            data
        );

        res.send(content)
    })
}

function answers (req,res){


	getData(req,res,function(data){
        var content =  swig.renderFile(temppath + 'answers.html',
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
	answers:answers, //all answers
	gather:gather,
}
