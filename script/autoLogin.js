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
    process.exit();
    return;
  }
  let filepath = `./cookies/${user.phone}.json`;
  let exists = fs.existsSync(filepath);
  console.log('是否存在文件', exists, filepath);
  if(exists){
    let content = fs.readFileSync(filepath);
    if(content.toString()){
      logger.info('已经登陆过了不需要继续', user.phone, user.pass);
      loginSuccess.push(user);
      return start();
    }
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
