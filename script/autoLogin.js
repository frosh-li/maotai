const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '123456',
//   database : 'accounts'
// });

//connection.connect();

var originPhones = require("../beijing4.2buy.json");
originPhones = [{"phone":"13414570045","pass":"wy40324700"},
  {"phone":"13650493675","pass":"wy40324700"},
  {"phone":"15999759990","pass":"wy40324700"},
  {"phone":"13267540771","pass":"wy40324700"},
  {"phone":"18825752409","pass":"wy40324700 "},
  {"phone":"15818274155","pass":"wy40324700"},
  {"phone":"13412214599","pass":"wy40324700"},
  {"phone":"13267574337","pass":"wy40324700"},
  {"phone":"18681019002","pass":"wy40324700"},
  {"phone":"13128074637","pass":"wy40324700"},
  {"phone":"15934570100","pass":"3122@yang "},
  {"phone":"13192054067","pass":"wy40324700"},
  {"phone":"13267549137","pass":"wy40324700"},
  {"phone":"13537418590","pass":"wy40324700"},
  {"phone":"13886972253","pass":"wy40324700"},
  {"phone":"18199743397","pass":"wy40324700"},
  {"phone":"15015247207","pass":"wy40324700"},
  {"phone":"15089493032","pass":"wy40324700"},
  {"phone":"13650842112","pass":"wy40324700"},
  {"phone":"18312696005","pass":"wy40324700"}]
const proxy = require('../controllers/proxy');

function start() {
  let user = originPhones.shift();
  if(!user){
    logger.info("全部登录完成");
    checkDone();
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);
  proxy.switchIp().then(() => {
  MaotaiService.login(user.phone, user.pass, userAgent)
    .then(data => {
      logger.info(data);

      // connection.query('update accounts set uid=? where phone=?',[data.data.UserId, user.phone], (err,data)=>{
      //   if(err){
      //     console.log(err);
      //   }
      // })

      start();
    })
    .catch(e => {
      logger.error(e);
      start();
    })
  }).catch(e => {console.log(e)})
}

// start();
const fs = require('fs');
const path = require('path')
function checkDone() {
  console.log("开始检查是否有未登录账号");
  let hasLogin = false;
  originPhones.forEach(item => {
    let cpath = path.resolve(__dirname,"../cookies/"+item.phone+".json");
    let out = fs.existsSync(cpath);
    if(!out){
      hasLogin = true;
      console.log(out)
    }
  })
  if(hasLogin === false){
    console.log("全部登录成功，请放心");
  }
  process.exit(0);
}

// checkDone();


// getAccounts()
//   .then(accounts => {
//     start();;  
//   }).catch(e => {
//     console.log(e);
//   })

// function getAccounts() {
//   return new Promise((resolve, reject) => {
//     connection.query('select phone,pass from accounts', (err, results) => {
//       if(err){
//         console.log(err);
//         return reject(false);
//       }
//       originPhones = results;
//       totals = results.length;
//       return resolve(true);
//     })
//   })
// }


start()
