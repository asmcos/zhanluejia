const puppeteer = require('puppeteer');
var isBot = require('isbot');

//export PUPPETEER_SKIP_DOWNLOAD='true' ,如果 puppeteer 安装失败，可以添加这个头

async function ssr(url) {
  const start = Date.now();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    // networkidle0 等待直到500ms内没有请求了
    await page.goto(url, {waitUntil: 'networkidle0'});
     
  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content(); // 获取HTML结构
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);
  return {html, ttRenderMs};
}




async function HandleRobot(req, res, next){
    var UA = req.headers['user-agent'];

    //这是puppeteer chrome头要去掉
	if (UA.search("HeadlessChrome") != -1){
        return 0
    }	
    if(UA && isBot(UA)){
        // 生成本地访问链接
        console.log(UA)
        
        var requestUrl = req.originalUrl
        
        requestUrl = "http://127.0.0.1:3090" + requestUrl;

        console.log(requestUrl)
         try{
            var results = await ssr(requestUrl);
            res.send(results.html);
            return 1;
         }catch(e){
            console.log('ssr failed', e);
            return 0
         }
               
    } 
    return 0;
};



exports = module.exports={
    HandleRobot:HandleRobot
}
