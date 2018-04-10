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
  { phone: '15949806339', pass: 'lhj0325' },
  { phone: '17097224268', pass: '123456' },
  { phone: '18032952504', pass: '123456' },
  { phone: '18201603185', pass: '123456' },
  { phone: '18207517996', pass: '123456' },
  { phone: '18333966217', pass: '123456' },
  { phone: '18382394514', pass: '123456' },
  { phone: '18629896680', pass: '123456' } ];
const proxy = require('../controllers/proxy');
if(process.argv[2] != undefined){
  originPhones = require(process.argv[2]);
}
console.log(originPhones);
function start() {
  let user = originPhones.shift();
  if(!user){
    logger.info("全部登录完成");
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);
  proxy.switchIp().then(() => {
  MaotaiService.login(user.phone, user.pass, userAgent)
    .then(data => {
      logger.info(data);
      start();
    })
    .catch(e => {
      logger.error(e);
      start();
    })
  }).catch(e => {console.log(e)})
}
start()
