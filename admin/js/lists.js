/* JSAdmin
 *  lists
 */

function Lists(){
	return this;
}


Lists.prototype = {

	get:function (list,options,vue){
		var that = this
		$.ajax({url:"/admin/api/get/"+list+"?fields="+options + "&limit="+vue.$data.pagesize+"&sort=-_id",
				dataType: "json",
            	success: function(data){
					//vue.$data.lists.push(m)

					data["results"].forEach(function(l){
						l["fields"]["id"] = l["id"]
						vue.$data.lists.push(l["fields"])

					})

					vue.$data.data = true
					vue.$data.lastpage = Math.ceil(data.count/vue.$data.pagesize)
				},
				error : function() {
    			},
		});

		$.ajax({url:"/admin/api/listcolumns/"+list,
				dataType: "json",
				success: function(data){
					// data['defaultColumns'].unshift({"label":"Id",path:"id"})
					vue.$data.header = data['defaultColumns']
					vue.$data.column = true

					vue.$data.xcsrftoken = data["csrf"]
				},
				error : function() {
				},
		});

	},
	getpage:function(list,options,vue,skip){
		        var that = this
		        $.ajax({url:"/admin/api/get/"+list+"?fields="+options + "&limit="+vue.$data.pagesize+"&sort=-_id&skip=" +skip,
                dataType: "json",
                success: function(data){
					vue.$data.lists = []
                    data["results"].forEach(function(l){
                        l["fields"]["id"] = l["id"]
                        vue.$data.lists.push(l["fields"])
                    })

                },
                error : function() {
                },
        	});
	},
	delete:function(list,id,vue){

			var Data = new FormData();

			Data.append("id",id)
		
			$.ajax({url:"/keystone/api/"+list+"/delete",
            	type:"POST",
            	beforeSend:function(request){
                	request.setRequestHeader("x-csrf-token",vue.$data.xcsrftoken)
            	},
            	cache: false,
            	processData: false,
            	contentType: false,     //ajax don't set request headers
				dataType: "json",
				data: Data,
            	success: function(data){
					var ifra = parent.subpage
					var timestamp = (new Date()).valueOf();
                    ifra.src = "/admin/lists.html?time="+timestamp;					
				}
			});
		
	},

}
