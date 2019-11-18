$(document).ready(function(){
		/**var code=getUrlParam('code');
		window.location.href='https://m.aiyinsitanfm.com/interior_share/ceshi?code='+code
		function getUrlParam(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r!=null) return unescape(r[2]); return null;
            }**/
			var code=getUrlParam('code');
			var appid = 'wx529772bcf8546e8d';
			var url=window.location.href;//url链接
			var redirect_uri1='https://www.jsstar.net/wxmp/index.html';//回调地址
			var redirect_uri=encodeURIComponent(redirect_uri1.split("#"));
			var response_type='code';
			var scope='snsapi_userinfo';
			var state='jishixingqiu';
			if(code == '' || code == 'undefined' || code == 'null' || code == null)//如果code为空，则去获取code
				{ 
						  window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+redirect_uri+"&response_type="+response_type+"&scope="+scope+"&state="+state+"#wechat_redirect";
				}
			else //如果code不为空则请求后台接口 获取openid
			{
				 $.ajax({
						url: 'https://www.jsstar.net/wxmp/callback',
						async: true,
						type: 'get',
						data: {
						  code: code
						},
						success:function(e){
							console.log(e);
							$(".userimg img").attr("src",e.headimgurl);
							$(".username").text(e.name);
						}
					  })
			}
				
		 
			 function getUrlParam(name){
				  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				  var r = window.location.search.substr(1).match(reg);
				  if (r!=null) return unescape(r[2]); return null;
				}
		
	})