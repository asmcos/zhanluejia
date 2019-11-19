/* JSAdmin
 * GetCha 
 */

function Cha(){
	return this;
}


Cha.prototype = {

	getNew:function (vue){
		var that = this
		$.ajax({url:"/zlj/newcaptcha",
				dataType: "json",
            	success: function(data){
					vue.$data.capid=data.id
					vue.$data.capimg=data.data
				},
				error : function() {
    			},
		});
 		
	},
}


