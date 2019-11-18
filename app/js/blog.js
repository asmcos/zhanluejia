/* JSAdmin
 * GetDb 
 */

function blogDb(){
	return this;
}


blogDb.prototype = {

	getBlog:function (vue,id){
		var that = this
		$.ajax({url:"/views/blog?id="+urlParam("id"),
				dataType: "json",
            	success: function(data){
					vue.$data.blog=data.blog
					vue.$data.prevblog=data.prevblog
					vue.$data.nextblog=data.nextblog
					vue.$data.sysconf=data.sysconf
				},
				error : function() {
    			},
		});
 		
	},
}

function urlParam (name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}

