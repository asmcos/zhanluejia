/* JSAdmin
 * shop list
 */

function ShopDb(){
	return this;
}


ShopDb.prototype = {
	getlist:function (vue){
		var that = this
		$.ajax({url:"/admin/api/shoplist?name=shop",
			dataType: "json",
			success: function(data){
				var shop = data.shop;
				vue.$data.shop = shop;
			},
			error : function() {
			},
		});

	},
}


