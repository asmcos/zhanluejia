var keystone = require('keystone');
var _ = require('lodash');
var async = require('async');
 
exports = module.exports = function (req, res) {


	if (!req.user || req.user.isAdmin != true){
		return res.status(403).send(keystone.wrapHTMLError('need admin user'));
	}


	var list = keystone.list(req.params.list)


	var UserList = keystone.list(keystone.get('user model'));


	var keystoneData = {
		adminPath: '/' + keystone.get('admin path'),
		appversion: keystone.get('appversion'),
		csrf: { header: {} },
		list:list.getOptions(),
		userList: UserList.key,
		version: keystone.version,
		wysiwyg: { options: {
			enableImages: keystone.get('wysiwyg images') ? true : false,
			enableCloudinaryUploads: keystone.get('wysiwyg cloudinary images') ? true : false,
			enableS3Uploads: keystone.get('wysiwyg s3 images') ? true : false,
			additionalButtons: keystone.get('wysiwyg additional buttons') || '',
			additionalPlugins: keystone.get('wysiwyg additional plugins') || '',
			additionalOptions: keystone.get('wysiwyg additional options') || {},
			overrideToolbar: keystone.get('wysiwyg override toolbar'),
			skin: keystone.get('wysiwyg skin') || 'keystone',
			menubar: keystone.get('wysiwyg menubar'),
			importcss: keystone.get('wysiwyg importcss') || '',
		} },
	};
	keystoneData.csrf.header[keystone.security.csrf.CSRF_HEADER_KEY] = keystone.security.csrf.getToken(req, res);


	var locals = {
		adminPath: keystoneData.adminPath,
		env: keystone.get('env'),
		fieldTypes: keystone.fieldTypes,
		keystone: keystoneData,
		title: keystone.get('name') || 'Keystone',
	};

	res.json(locals)

}
