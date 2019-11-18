/* JSAdmin
 * Image list
 */

function ImageDb(){
	return this;
}


ImageDb.prototype = {

	getlist:function (vue){
		var that = this
		$.ajax({url:"/admin/api/imagelist",
				dataType: "json",
            	success: function(data){


					var img = data.img
					img.forEach(function(i){
						var newImg = new Image();
						newImg.src = "/static/uploads/" + i.image.filename;
						i.width = newImg.width
						i.height = newImg.height
					})



					var half = img.length / 2 

					vue.$data.col1 = img.slice(0,half)
					vue.$data.col2 = img.slice(half)

				},
				error : function() {
    			},
		});
 		
	},
}


