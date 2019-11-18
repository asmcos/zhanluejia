/* JSAdmin
 * unSplash api 
 */

function unSplash(){
	return this;
}


unSplash.prototype = {

	getlist:function (vue){
		var that = this
		$.ajax({url:"/admin/api/unsplashlist",
				dataType: "json",
            	success: function(data){
					var half = data.length / 2 

					vue.$data.col1 = data.slice(0,half)
					vue.$data.col2 = data.slice(half)

				},
				error : function() {
    			},
		});
 		
	},
	getSearch:function(vue,words){

		$.ajax({
			url:"/admin/api/unsplashsearch?search=" + words,
			dataType:"json",
			success: function(data){
					var results = data.results 
					var half = results.length / 2 

					vue.$data.col1 = results.slice(0,half)
					vue.$data.col2 = results.slice(half)

		},
		});//ajax
	},	
}


