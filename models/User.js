var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true }, //firstname is weapp nickname
	email: { type: Types.Email, initial: true, required: true },
	password: { type: Types.Password, initial: true, required: true },
	avatar: {type:Types.Text},
	weappopenId: {type:Types.Text},                 // weapp openId
	wxunionId: {type:Types.Text},                   // weapp unionId 
	phoneNum: {type:Types.Number},
	wxmpopenId: {type:Types.Text},
	registerType: {type:Types.Number,default:0} // 0:keystone orginal,1:weapp,2:wxmp

}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});



/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
