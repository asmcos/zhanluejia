/* JSAdmin
 *  forms
 */

function Forms(){
	return this;
}


//opts is keystone fields

function input(opts){
	
	return formCreate.maker.input(opts['label'],opts['path']).col({span: 12}).validate({required:opts['required']})
}

function formswitch(opts){

	return formCreate.maker.switch(opts['label'],opts['path'],"0").validate({required:opts['required']})
}


function password(opts){

	return formCreate.maker.password(opts['label'],opts['path']).col({span:8}).validate({required:opts['required']})
}

function email(opts){

	return formCreate.maker.input(opts['label'],opts['path']).col({span: 10}).validate({required:opts['required']})

}

function url(opts){

	//image src url
	if (opts.collapse == "unsplashimg") {	
	  return formCreate.maker.url(opts['label'],opts['path']).col({span: 18}).validate({required:opts['required']}).children([

	    formCreate.maker.create('i-button').domProps({
          innerHTML: '从库里选择'
        }).slot("append").style({background:'#2d8cf0',color: '#fff'}).on ({
    						click: function(e){
								toUnsplash(e.target.parentElement.previousElementSibling.id)
							 } 
  							})
                                        			
								
	   ]).children([

	   formCreate.maker.create('i-button').domProps({
         innerHTML: '本地上传',
       }).slot("append").style({    background: '#f39c12',color:'#fff',
    		margin: '-6px -7px -7px 10px'}).on({
				click:function(e){
					toUpload(e.target.parentElement.previousElementSibling.id)
				}
			})											
	   ])

	 } else {
	 		// generic url
		 return formCreate.maker.url(opts['label'],opts['path']).col({span: 12}).validate({required:opts['required']})
	}
}


function number(opts){
	
	return formCreate.maker.number(opts['label'],opts['path']).col({span: 6}).validate({required:opts['required']})
}

function color(opts){
	
	return formCreate.maker.color(opts['label'],opts['path'],'#F12345').validate({required:opts['required']})
}

function select(opts){
	
	return formCreate.maker.select(opts['label'],opts['path']).options(opts['ops']).props({
        // multiple:true
	}).col({span:6}).validate({required:opts['required']})
}
function date(opts){
	
	return formCreate.maker.date(opts['label'],opts['path'],[new Date()]).props({
        "type": "date",
	}).validate({required:opts['required']})
}
function datetime(opts){
	
	return formCreate.maker.date(opts['label'],opts['path'],[new Date()]).props({
        "type": "datetime",
	}).validate({required:opts['required']})
}

function file(opts){
	

	if (opts.collapse == "image") {	

	   return  formCreate.maker.create('input',opts['path'],opts['label']).props({
            	type: "file",
            }).attrs({
		    	accept: "image/*",
			}).col({span:12}).validate({required:opts['required']})

	} else {
		return  formCreate.maker.create('input',opts['path'],opts['label']).props({
			type: "file",
  			}).col({span:12}).validate({required:opts['required']})
	}
}
function textarea(opts){
	
	return formCreate.maker.input(opts['label'],opts['path']).col({span: 12}).props({
        "type": "textarea",
        "rows":5
      }).col({span:16}).validate({required:opts['required']})
}

function html(opts){
	
	return formCreate.maker.input(opts['label'],opts['path']).col({span: 12}).props({
        "type": "textarea",
        "rows":5,
      }).col({span:16}).className("tinyMCE").emit('change').validate({required:opts['required']})

}
var CreateTable={
	"email":email,
	"boolean":formswitch,
	"password":password,
	"url":url,
	"number":number,
	"textarea":textarea,
	"file":file,
	"color":color,
	"date":date,
	"datetime":datetime,
	"html":html,
	"select":select,
}

function getMaker(field){
	

	maker = CreateTable[field.type]

	if (!maker){
		return input(field)
	}
	
	return maker(field)

}

function getFieldByEl(vue,id,content){

	vue.$data.rule.forEach(function(f){
		if (f.props.elementId === id){
			f.value = content
		}
	})

}

function convertData(vue,data){

	var Data = new FormData();

	vue.$data.rule.forEach(function(f){

		// 当重新编辑 密码和文件类型的时候 value === “”  代表没有改变。
        // 也就是说如果编辑状态是把原有密码设置密码为空，
		//   或者把以前上传的文件删除为空值 这两种操作目前不支持。

		if (f.value === "" ){
			if (f.props.type === "password" || f.props.type === "file")
				return 
		} //不设置空值

		if (f.props.type === "file"){
			Data.append(f.field, $("#"+f.props.elementId)[0].files[0])
		} else {
			Data.append(f.field, f.value)
		}
	})
	return Data
}

Forms.prototype = {

	set:function (list,vue){
		var that = this
		$.ajax({url:"/admin/api/form/" + list,
				dataType: "json",
            	success: function(data){
					var fields = data["keystone"]["list"]["fields"];
					var rule = []	;				

				
					Object.keys(fields).forEach(function(k){
						
						rule.push(getMaker(fields[k]))
					})
					vue.$data.xcsrftoken = data["keystone"]["csrf"]["header"]["x-csrf-token"]					

					vue.$data.rule = rule
					vue.$nextTick(function(){
									tinymce.init({selector:'.tinyMCE textarea',    
											width:'800',
											height:'600',
											plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
             "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
             "save table contextmenu directionality emoticons template paste textcolor"
       ],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons", 
										
											setup: function (editor) {
												editor.on(
              										'input change undo redo', () => {
              											editor.save() 
														getFieldByEl(vue,this.id,editor.getContent())
													})
        										}
    									})//init
								})
				},
				error : function() {
    			},
		});


	},
	setform:function (list,vue,formdata){ //edit form
		var that = this

		$.ajax({url:"/admin/api/form/" + list,
				dataType: "json",
            	success: function(data){
					var fields = data["keystone"]["list"]["fields"];
					var rule = []	;				

				
					Object.keys(fields).forEach(function(k){

						
						var field = getMaker(fields[k])	

						// formdata from db
						// input.type == file
                        // display old filename by a children element.
						// 编辑数据来自数据库
                        // 1. password 类型和空值 都不需要赋值
						// 2. name 类型,只取first,
						// 3. file 类型，如果没有filename就走走空值，有filename 
						// 当类型是 fileupload时,之前上传的文件名,不能显示在input.type=file控件里
                        // 只能采取children方法，追加一个span来显示老的文件名字
						// 如果用户新选择了文件，我们获取change事件，remove老的文件名（children控件）

						if (formdata[k] && fields[k].type != "password"){
								
							if (fields[k].type === "name"){

								field.rule.value = formdata[k].first

							} else if (fields[k].type === "file" ) { //recreate input.type=file and append a children

								if (formdata[k].filename) {
								
									field = formCreate.maker.create('input',fields[k]['path'],fields[k]['label']).props({
            								type: "file",
           								 }).col({span:12}).children([
  									  			formCreate.maker.create('span').children([formdata[k].filename]).slot('append')
										]).event({
											    change:function(e){
												  // when select a new file,auto delete children
												   e.target.nextElementSibling.remove()
											    }
										})
								}

							} else {
								//default
								field.rule.value = formdata[k]
							}
						} else if(fields[k].type === "password"){
								field = formCreate.maker.password(fields[k]['label'],fields[k]['path']).col({span:8})
						}
						rule.push(field)
					})

					vue.$data.xcsrftoken = data["keystone"]["csrf"]["header"]["x-csrf-token"]					

					vue.$data.rule = rule

					vue.$nextTick(function(){
									tinymce.init({selector:'.tinyMCE textarea',    

											width:'800',
											height:'600',
   plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
             "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
             "save table contextmenu directionality emoticons template paste textcolor"
       ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons",


											setup: function (editor) {
												editor.on(
              										'input change undo redo', () => {
              											editor.save() 
														getFieldByEl(vue,this.id,editor.getContent())
													})
        										}
    									})//init
					})
	

    			},
				error : function() {
    			},
		});


	},
	getDataById:function (list,vue,url){
		
		var that = this
		id = urlParam(url,"id")
		$.ajax({url:"/keystone/api/" + list + "/" + id,
				dataType: "json",
            	success: function(data){
					that.setform(list,vue,data.fields)
				
				},//success
		})
	},
	
	post:function(list,vue,data){
		
		var formData = convertData(vue,data)	


		$.ajax({
			url:"/keystone/api/" + list + "/create",	
			type:"POST",
			beforeSend:function(request){
				request.setRequestHeader("x-csrf-token",vue.$data.xcsrftoken)
			},
			cache: false,
			processData: false, 
			contentType: false,     //ajax don't set request headers
			data:formData,          //submit data
			dataType:"json",        //return data type
			success:function(data){
				var ifra = parent.subpage
				var timestamp = (new Date()).valueOf();
                ifra.src = "/admin/lists.html?time="+timestamp;
			}
		});//ajax
	},
	update:function(list,vue,data,url){
		
		id = urlParam(url,"id")
		var formData = convertData(vue,data)	

		$.ajax({
			url:"/keystone/api/" + list + "/" + id ,	
			type:"POST",
			beforeSend:function(request){
				request.setRequestHeader("x-csrf-token",vue.$data.xcsrftoken)
			},
			cache: false,
			processData: false, 
			contentType: false,     //ajax don't set request headers
			data:formData,          //submit data
			dataType:"json",        //return data type
			success:function(data){
				var ifra = parent.subpage
				var timestamp = (new Date()).valueOf();
                ifra.src = "/admin/lists.html?time="+timestamp;
			}
		});//ajax
	}

}


function urlParam (url,name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}


// Select image from splash or uploadfile
var current_inputId ;
function toUnsplash(id){
	current_inputId = id
	$("#unsplash1").show()
	$("#app1").hide()
}

function showApp(){
	$("#app1").show()
	$("#unsplash1").hide()
	$("#upload1").hide()
}

function toUpload(id){
	current_inputId = id
	$("#upload1").show()
	$("#app1").hide()
}

function backUnsplash(vue,url){
	showApp()
	getFieldByEl(vue,current_inputId ,url)
	$("#" + current_inputId).val(url)
}
