/* JSAdmin
 * GetDb 
 */

function mainDb(){
	return this;
}


mainDb.prototype = {

	getInfo:function (vue){
		var that = this
		$.ajax({url:"/views/index",
				dataType: "json",
            	success: function(data){
					vue.$data.blog=data.blog
					vue.$data.sysconf=data.sysconf
				},
				error : function() {
    			},
		});
 		
	},
}


