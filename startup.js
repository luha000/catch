const puppeteer = require('puppeteer');
const fs = require('fs');
// const readline = require('readline');

var fetch = require("node-fetch");
var path = require("path");
var http = require("http");

let request_url = 'https://www.baidu.com';
// let baseDir = 'sites/baidu';

const server = http.createServer();

server.on("request", function(req, res) {
   var dataString = '';
   req.on("data", function(data) {
      dataString += (data.toString())
   });

   req.on("end", function() {
      console.log(dataString);
      fs.appendFileSync('./data.json', dataString + '\n', 'utf8');
   });

   // 设置响应头（现在的用法，常用），可以多次调用，每次设置一个响应头
   res.setHeader("Content-Type", "text/json,charset=utf-8");
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

   // 设置状态码，不设置默认为 200
   res.statusCode = 200;

   // 返回内容
   res.end("{state:'成功'}"); // 将内容返回后关闭连接
});

server.listen(8000, function() {
  console.log("server start 8000");
});

// 递归创建目录 异步方法
function mkdirs(dirname, callback) {
   fs.exists(dirname, function (exists) {
      if (exists) {
         callback();
      } else {
         // console.log(path.dirname(dirname));
         mkdirs(path.dirname(dirname), function () {
               fs.mkdir(dirname, callback);
               console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
         });
      }
   });
}
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
   if (fs.existsSync(dirname)) {
      return true;
   } else {
      if (mkdirsSync(path.dirname(dirname))) {
         fs.mkdirSync(dirname);
         return true;
      }
   }
}

function download(u, p) {
   return fetch(u, {
       method: 'GET',
       headers: { 'Content-Type': 'application/octet-stream' },
   }).then(res => res.buffer()).then(_ => {
      let dirs = p.substring(0, p.lastIndexOf('/'));
      console.log(p + '===dirs == ' + dirs);

      mkdirs(dirs, () => {
         fs.writeFile(p, _, "binary", function (err) {
            console.log(err || p);
         });
      })
   });
}

(async () => {
   const browser = await puppeteer.launch({
      // headless: false
      'args': [
         '--disable-web-security',
         '--allow-http-screen-capture',
         '--allow-running-insecure-content',
         '--disable-features=site-per-process',
         '--no-sandbox',
         '--window-size=1920,1080'
      ],
      headless: false,
      slowMo: 20,
      defaultViewport: {
         width:1920,
         height:1080
      }
   });

   browser.on('targetcreated', async function(target) {
      console.log('---create', target.url());

      const newPage = await target.page()

      if(!newPage) {
         return;
      }

      await newPage.waitForNavigation({
         waitUntil: 'domcontentloaded'
      })

      await newPage.addStyleTag({
         path: './plugin.css',
         type: "text/css"
      });

      await newPage.addScriptTag({
         path: './jquery.min.js',
         type: "text/javascript"
      });

      await newPage.addScriptTag({
         path: './plugin.js',
         type: "text/javascript"
      });
   });

   browser.on('targetchanged', async function(target) {
      const newPage = await target.page()

      if (!newPage) {
         return;
      }

      await newPage.waitForNavigation({
         waitUntil: 'domcontentloaded'
      })

      await newPage.addStyleTag({
         path: './plugin.css',
         type: "text/css"
      });

      await newPage.addScriptTag({
         path: './jquery.min.js',
         type: "text/javascript"
      });

      await newPage.addScriptTag({
         path: './plugin.js',
         type: "text/javascript"
      });
   });

   const page = await browser.newPage();

   console.log('---vvv---new---page');

   function logRequest(interceptedRequest) {
      // console.log('A request was made:', interceptedRequest.url());
    }
    page.on('request', logRequest);

   // 访问
   await page.goto(request_url, {waitUntil: 'domcontentloaded'}).catch(err => console.log(err));
   await page.waitFor(2000);

   const dimensions = await page.evaluate(() => {
      return {
         width: document.documentElement.clientWidth,
         height: document.documentElement.clientHeight,
         deviceScaleFactor: window.devicePixelRatio
      };
   });

   try {
      // 截图
      const pageTitle = await page.title();

      await page.screenshot({ path: 'screenshot/' + pageTitle + '.jpg', fullPage:true}).catch(err => {
         console.log('截图失败');
         console.log(err);
      });

      await page.waitFor(5000);
   } catch (e) {
      //console.log('执行异常');
   } finally {
      //await browser.close();
   }

   // await page.addStyleTag({
   //    path: './plugin.css',
   //    type: "text/css"
   // });

   // await page.addScriptTag({
   //    path: './jquery.min.js',
   //    type: "text/javascript"
   // });

   // await page.addScriptTag({
   //    path: './plugin.js',
   //    type: "text/javascript"
   // });
   console.log('Dimensions:', dimensions);

   // await page.setRequestInterception(true);
   // await page.on('request', request => {
   //    console.log(request.resourceType());

   //    if (request.resourceType() === 'document') {
   //        console.log("image: ");
   //        let res = request.response();
   //        console.log(request.url);
   //        console.log(res);
   //        request.abort();
   //    } else {
   //        // request.respond({
   //        //     status: 200,
   //        //     contentType: 'text/plain',
   //        //     body: 'GOOD!'
   //        // });
   //        console.log("continue")
   //        request.continue();
   //    }
   // });
//   await page.mouse.click(0, 0);
  // //将数据写入到文件中，通过fs模块
  // let apiData = {
  //     data: result,
  //     code: 0,
  //     message: 'success'
  // }

  // fs.writeFile('course-list.json',JSON.stringify(apiData,null,'\t'));

//   const aHandle = await page.evaluateHandle(() => document.documentElement);
//   const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
//   const value = await resultHandle.jsonValue();

//  mkdirs(baseDir, function(error){
//    if(error){
//       console.log(error);
//       return false;
//    }
//    console.log('创建目录成功');

//    let newValue = '';

//    fs.writeFile('sites/bj/index-base.html', value, (err) => {
//       if (err) {
//          console.log('写入文件操作失败');
//       } else {
//          console.log('写入文件操作成功');

//          let input = fs.createReadStream('sites/baidu/index-base.html')
//          const rl = readline.createInterface({
//             input: input
//          });
//          rl.on('line', (line) => {
//             let newLine = line;

//             if(line.indexOf('src="') >= 0 && line.indexOf('src="http') < 0) {
//                if(line.indexOf('src="') > 0) {
//                   let src = line.substring(line.indexOf('src="') + 6, line.length - 1);

//                   src = src.substring(0, src.indexOf('"'));
//                   console.log(src);
//                   let url = 'https://www.baidu.com/' + src;
//                   newLine = line.substring(0, line.indexOf('src="') + 5) + '' + line.substring(line.indexOf('src="') + 6, line.length);

//                   download(url, baseDir + '/' + src)
//                }
//             }
//             else if(line.indexOf('<link') >= 0 && line.indexOf('href="http') < 0) {
//                if(line.indexOf('href="') > 0) {
//                   let src = line.substring(line.indexOf('href="') + 7, line.length - 1);

//                   src = src.substring(0, src.indexOf('"'));
//                   console.log(src);
//                   let url = 'https://www.baidu.com/' + src;
//                   newLine = line.substring(0, line.indexOf('href="') + 6) + '' + line.substring(line.indexOf('href="') + 7, line.length)

//                   download(url, baseDir + '/' + src)
//                }
//             }

//             newValue += newLine + '\n';
//          });
//          rl.on('close', (line) => {
//             console.log("读取完毕！");

//             fs.writeFile('sites/baidu/index.html', newValue, (err) => {

//             });
//          });
//       }
//    });
// })
//   await resultHandle.dispose();
})();
