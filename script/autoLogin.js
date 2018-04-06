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

function start() {
  let user = originPhones.shift();
  if(!user){
    logger.info("全部登录完成");
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);
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