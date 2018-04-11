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

var originPhones = [
  {"phone":"15133355337","pass":"a123456","addressId":1962238}
]
var loginSuccess = [];
const proxy = require('../controllers/proxy');
if(process.argv[2] != undefined){
  originPhones = require(process.argv[2]);
}
console.log(originPhones);
function start() {
  let user = originPhones.shift();
  if(!user){
    logger.info("全部登录完成");
    console.log(JSON.stringify(loginSuccess, null, 4));
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);
  proxy.switchIp().then(() => {
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
      start();
    })
  }).catch(e => {console.log(e)})
}
start()
