/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);
var path = require('path');

// Import Route Controllers
var routes = {
    views: importRoutes('./views'),
    api: importRoutes('./api'),
    wxmp: importRoutes('../wxmp/api'),
    zlj: importRoutes('../zlj/api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
    // Views

    app.get('/admin/api/index', routes.api.index);
    app.get('/admin/api/get/:list', routes.api.get);
    app.get('/admin/api/form/:list', routes.api.uiform);
    app.get('/admin/api/lists', routes.api.lists);
    app.get('/admin/api/listcolumns/:list', routes.api.listcolumns);

    app.get('/admin/api/unsplashlist', routes.api.unsplashapi);
    app.get('/admin/api/unsplashsearch', routes.api.unsplashapi.search);

    app.get('/admin/api/imagelist', routes.api.imageapi);
    app.get('/admin/api/shoplist', routes.api.shop);
	// use static for admin
	app.use('/admin', keystone.express.static(path.join(__dirname, '../admin')))

	//other static ,admin-lte,bootstrap,
	app.use('/static', keystone.express.static(path.join(__dirname, '../public')))


	//client app routers
	app.use('/js/', keystone.express.static(path.join(__dirname, '../app/js')))
	/*app.use('/', keystone.express.static(path.join(__dirname, '../app/theme/blog')))*/
	app.use('/shop/', keystone.express.static(path.join(__dirname, '../app/theme/shop')))
    app.get('/views/index', routes.views.index);
    app.get('/views/blog', routes.views.blog);

	//ckeditor
	app.use('/ckeditor/', keystone.express.static(path.join(__dirname, '../ckeditor')))

    //wangEditor
    app.use('/wangEditor/',keystone.express.static(path.join(__dirname,'../wangEditor/release/')))

	// 微信公众号
	app.use('/wxmp/', keystone.express.static(path.join(__dirname, '../wxmp/')));
	app.use('/wxmp/callback', routes.wxmp.api.callback);
	app.use('/wxmp/my', routes.wxmp.api.my);
    app.use('/wxmp/getConfig',routes.wxmp.api.getConfig);
    app.use('/wxmp/angelcustom',routes.wxmp.angelcustom.angelcustom); //微信自动回复接口

	// 战略家 pc,h5
	app.use('/zlj/', keystone.express.static(path.join(__dirname, '../zlj/www')));
	app.use('/zlj/register', routes.zlj.user.register);
	app.use('/zlj/login', routes.zlj.user.login);
	app.use('/zlj/newcaptcha', routes.zlj.captcha.new);
	app.use('/zlj/getcode', routes.zlj.captcha.getCode);
	app.use('/zlj/loginpw', routes.zlj.user.loginpw);
	app.use('/zlj/my', routes.zlj.user.my);
    app.use('/zlj/updateuser', routes.zlj.user.updateuser);
    app.use('/zlj/uploadavatar', routes.zlj.user.uploadavatar);
    app.use('/zlj/listTop',routes.zlj.user.listTop);

    // redirect ,wechat jssdk domain is www.zhanluejia.net.cn/zlj
    app.get('/', function(req,res){
        return res.redirect("/zlj/index.html")
    });
	app.use('/zlj/index.html', routes.zlj.html.index);
    app.use('/zlj/gather.html', routes.zlj.html.gather);
	app.use('/zlj/my.html', routes.zlj.html.my);
    app.use('/zlj/newquestion.html', routes.zlj.html.newquestion);
    app.use('/zlj/question.html', routes.zlj.html.question); //list question and answers
    app.use('/zlj/answer.html', routes.zlj.html.answer);   // question title + a answer.html
    app.use('/zlj/updateanswer.html', routes.zlj.html.updateanswer);   // updateanswer.html
    app.use('/zlj/answers.html', routes.zlj.html.answers); //list all answers
    app.use('/zlj/investments.html', routes.zlj.html.investments); //list all investments
    app.use('/zlj/newpe.html', routes.zlj.html.newpe);  //获取抖音uid
    app.use('/zlj/pushevents.html', routes.zlj.html.pushevents);  //获取所有关注点赞列表
    app.use('/zlj/pushevent.html', routes.zlj.html.pushevent);  //获取某一个关注点赞事件
    app.use('/zlj/mypusheventexs.html', routes.zlj.html.mypusheventexs);  //别人完成了我的任务，我得到的消息
    app.use('/zlj/mypushdone.html', routes.zlj.html.mypushdone); //我完成的
    app.use('/zlj/pusheventexs.html', routes.zlj.html.pusheventexs);//交易广场
    app.use('/zlj/search.html', routes.zlj.html.search);//搜索页面


    app.use('/zlj/uploadimage',routes.zlj.upload.uploadimage);

    //questsion
    app.use('/zlj/newquestion', routes.zlj.question.create);
    app.get('/zlj/listquestion', routes.zlj.question.list);
    app.get('/zlj/delquestion', routes.zlj.question.del);
    app.get('/zlj/listanswer', routes.zlj.question.listanswer);
    app.get('/zlj/myquestions', routes.zlj.question.myquestions);

    //answer
    app.use('/zlj/newanswer', routes.zlj.answer.create);
    app.use('/zlj/answer', routes.zlj.answer.answer); //list a answer
    app.use('/zlj/updateanswer', routes.zlj.answer.updateanswer); //list a answer
    app.use('/zlj/delanswer', routes.zlj.answer.del);
    app.use('/zlj/myanswers', routes.zlj.answer.myanswers);
    app.use('/zlj/answers', routes.zlj.answer.list);
    app.use('/zlj/answerlike', routes.zlj.answer.like); //点赞

    //comment
    app.use('/zlj/comment', routes.zlj.comment.create);
    app.use('/zlj/listcomment', routes.zlj.comment.list);


    //investment
    app.use('/zlj/listinvestment', routes.zlj.investment.list);

    //angelcustomers
    app.use('/zlj/createpe', routes.zlj.angelcustomers.createpe); //创建一个抖音请求
    app.use('/zlj/listpushevent',routes.zlj.angelcustomers.listpushevent); //列出所有的请求
    app.use('/zlj/createpushex',routes.zlj.angelcustomers.createpushex); //提交一个完成交易事件
    app.use('/zlj/confirmpushex',routes.zlj.angelcustomers.confirmpushex); //确认交易真实完成
    app.use('/zlj/listpusheventex',routes.zlj.angelcustomers.listpusheventex);//列出最近的交易事件
    app.use('/zlj/mypusheventexs',routes.zlj.angelcustomers.mypusheventexs);//我的事件

    app.use('/zlj/search',routes.zlj.search.search);//搜索数据

    app.use('/corlate', keystone.express.static(path.join(__dirname, '../theme/corlate')))

};
