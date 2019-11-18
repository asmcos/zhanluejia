var keystone = require('keystone');
var _ = require('lodash');
var async = require('async');
 
exports = module.exports = function (req, res) {


	if (!req.user || req.user.isAdmin != true){
		return res.status(403).send(keystone.wrapHTMLError('need admin user'));
	}

	list = keystone.list(req.params.list);


    if (!list) {
        if (req.headers.accept === 'application/json') {
            return res.status(404).json({ error: 'invalid list path' });
        }
        req.flash('error', 'List ' + req.params.list + ' could not be found.');
        return res.redirect('/' + keystone.get('admin path'));
    }


	var columns = list.defaultColumns;

	columns = columns.filter(i => i.path !== "_id");

	var defaultColumns = columns.map(function (c) {
        return _.pick(c, ['label', 'path']);
   	});	

   csrf = keystone.security.csrf.getToken(req, res);
	
   return res.json({defaultColumns:defaultColumns,csrf:csrf});
   

}
