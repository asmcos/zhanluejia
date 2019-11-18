/* JSAdmin
 * GetDb 
 */

function DbMenu(){
	return this;
}

//menu data format
/*
     data: {
       menus: [
        { title: 'MENU', vclass: 'header' },
        { title: 'Home', url: '/admin/home' },
        { title: 'Bar',
         url: '/admin/bar',
         vclass: 'treeview',
         submenus: [
          { title: 'Bar1', url: '/admin/bar1' },
          { title: 'Bar2', url: '/admin/bar2' }
         ]
        }
      ]
    }
*/

DbMenu.prototype = {

	getDBInfo:function (vue,menudata){
		var that = this
		$.ajax({url:"/admin/api/lists",
				dataType: "json",
            	success: function(data){
					var keys = Object.keys(data);
					menudata.forEach(function(menu){
						k = menu.fields.url

						var m = {title : menu.fields.title,url:data[k].path,count:data[k].count,options:data[k].options.defaultColumns,
								icon:"fa fa-"+menu.fields.icon,type:1}
						
						vue.$data.menus.push(m)
					})
					that.getOtherMenu(vue)
				},
				error: function(e) {
        		 	var pathname = window.location.pathname
					window.location.href= "/keystone/signin?from=" + pathname 
    			},
		});
 		
	},
	getDbMenu:function(vue){
		var that = this
		var filterdata='{"type":{"value":1}}';

		$.ajax({
			url:"/admin/api/get/menus?filters=" + filterdata,
			dataType:"json",
			success: function(data){
				that.getDBInfo(vue,data['results'])
			},
			error: function(e) {
        		 	var pathname = window.location.pathname
					window.location.href= "/keystone/signin?from=" + pathname 
    		},
		});//ajax
	},	
	getOtherMenu:function(vue){
		var that = this
		var filterdata='{"type":{"value":2}}';

		$.ajax({
			url:"/admin/api/get/menus?filters=" + filterdata,
			dataType:"json",
			success: function(data){
				data['results'].forEach(function(menu){
					var m = {title:menu.fields.title,url:menu.fields.url,icon:"fa fa-"+menu.fields.icon,type:2}
					vue.$data.menus.push(m)
				})
			},
			error: function(e) {
        		 	var pathname = window.location.pathname
					window.location.href= "/keystone/signin?from=" + pathname 
    		},
		});//ajax

	},
}


