/*
 * zlj common js
 */

 function Vfilter(){


     function toLocaleString(str){
         var d = new Date(str)
         return d.toLocaleString()
     }
     Vue.filter('LocaleTime',toLocaleString)

     function toLocaleYMD(str){

         return str.split("T")[0]
     }
     Vue.filter('tolocalYMD',toLocaleYMD)

     Vue.filter('platformname',function(s){
         if (s == 1){
             return "抖音"
         } else if(s==2){
             return "快手"
         }
     })

     Vue.filter('eventName',function(s){
         if (s == 1){
             return "关注"
         } else if (s == 2){
             return "点赞"
         }
     })

     Vue.filter('linkAddress',function(pee){
         if (pee.pushevent.platform == 1){
             // 抖音

             if(pee.pushevent.eventType == 1){ //关注
                 return "snssdk1128://user/profile/"+pee.pushevent.eventId
             } else if(pee.pushevent.eventType == 2){//视频
                 return "snssdk1128://aweme/detail/" + pee.pushevent.eventId
             }
         }

     })
     Vue.filter('linkAddresspe',function(pe){
         if (pe.platform == 1){
             // 抖音

             if(pe.eventType == 1){ //关注
                 return "snssdk1128://user/profile/"+pe.eventId
             } else if(pe.eventType == 2){//视频
                 return "snssdk1128://aweme/detail/" + pe.eventId
             }
         } else if (pe.platform == 2){
             if(pe.eventType == 1){ //关注
                 return "kwai://profile/"+pe.eventId
             } else if(pe.eventType == 2){//视频
                 return "kwai://work/" + pe.eventId
             }
         }

     })


     Vue.filter('Countfilter',function(count){
         if (count < 0){
             return 0
         } else {
             return count
         }
     })

     Vue.filter('exchangeStatus',function(s){

         if (s == "0"){
             return "我要确认"
         } else if(s == "1"){
             return "我已确认"
         }

     })
    return this
 }

 function Share( ){
     var url = encodeURIComponent(window.location.href.split("#"));
     var shareurl = window.location.href.split("#")[0]

     $.ajax({url:"/wxmp/getconfig?url=" +url,
         type: 'GET',
         success: function(data){
             var params = data

             params.jsApiList = [
                 'updateAppMessageShareData',
                 'updateTimelineShareData',
                 'hideOptionMenu'
             ];
             params.debug = false
             var share_desc = '<%= sysconf.share_desc%>'
             if (share_desc.length < 5){
                 share_desc = '有趣的心灵总会相遇。'
             }
             wx.config(params)
             wx.ready(function(){
                 // 分享给好友，或者群
                 wx.updateAppMessageShareData({
                     title: '【战略家】最新融资信息', // 分享标题
                     desc: share_desc, // 分享描述
                     link: shareurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                     imgUrl: 'http://www.zhanluejia.net.cn/static/img/logo.jpg', // 分享图标
                     success: function () {
                     // 设置成功
                     }
                 })
                 //分享给朋友圈
                 wx.updateTimelineShareData({
                     title: '【战略家】最新融资信息', // 分享标题
                     link: shareurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                     imgUrl: 'http://www.zhanluejia.net.cn/static/img/logo.jpg', // 分享图标
                     success: function () {
                       // 设置成功
                     }
                 })//updateTimelineShareData

             })

         }//success
     })//ajax

 } //share
