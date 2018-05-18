const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const fs = require('fs');
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '123456',
//   database : 'accounts'
// });

//connection.connect();

var originPhones = [
]

var loginSuccess = [];
const proxy = require('../controllers/proxy');
if(process.argv[2] != undefined){
  originPhones = require(process.argv[2]);
}
console.log(originPhones);
function start() {
  let user = originPhones.shift();
  console.log(user);
  if(!user){
    logger.info("全部登录完成");

    console.log(JSON.stringify(loginSuccess, null, 4));
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);

  MaotaiService.login(user.phone, user.pass, userAgent)
    .then(data => {
      logger.info(data);
      if(data.code === 0){
        loginSuccess.push(user);
      }
      start();
    })
    .catch(e => {
      logger.error(e);
      // 退回继续登录
      if(e.message.indexOf('密码错误') > -1){

      }else{
        // originPhones.unshift(user);
      }

      start();
    })

}
start()
