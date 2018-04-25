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
  { phone: '13624666057', pass: 'a123456', addressId: 1930787 },
  { phone: '15935492346', pass: 'a123456', addressId: 1930788 },
  { phone: '15082907866', pass: 'a123456', addressId: 1951812 },
  { phone: '18533703270', pass: 'a123456', addressId: 1951805 },
  { phone: '13513642792', pass: 'a123456', addressId: 1951737 },
  { phone: '15665166293', pass: 'a123456', addressId: 1951731 },
  { phone: '15830750275', pass: 'a123456' },
  { phone: '13720689056', pass: 'a123456', addressId: 1951717 },
  { phone: '15238555689', pass: 'a123456', addressId: 1951714 },
  { phone: '15549208672', pass: '123456', addressId: 1905922 },
  { phone: '18834168128', pass: 'A3396815', addressId: 1898547 },
  { phone: '18537303412', pass: 'z410781' },
  { phone: '15075870950', pass: '123456', addressId: 1712578 },
  { phone: '13593493641', pass: 'a123456' }
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
        originPhones.unshift(user);
      }
      
      start();
    })

}
start()
