var keystone = require('keystone');
var _ = require('lodash');
var async = require('async');
 
exports = module.exports = function (req, res) {


	if (!req.user || req.user.isAdmin != true){
		return res.status(403).send(keystone.wrapHTMLError('need admin user'));
	}

    var lists = [];
	var menus= {};

	 _.forEach(keystone.lists, function (list, key) {
        lists.push (list);
    });

	async.each(lists, function (list, next) {
	
        list.model.count(function (err, count) {
            menus[list.key] = {path:list.path,count:count,options:list.getOptions()};
            next(err);
        });
    }, function (err) {
        if (err) return res.apiError('database error', err);
        return res.json(menus);
    });



}
