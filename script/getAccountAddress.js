/**
 * 获取账号的地址信息
 * 
 * @type {[type]}
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const proxy = require('../controllers/proxy');

var originPhones = [{ phone: '15949806339', pass: 'lhj0325' },
  { phone: '17097224268', pass: '123456' },
  { phone: '18032952504', pass: '123456' },
  { phone: '18201603185', pass: '123456' },
  { phone: '18207517996', pass: '123456' },
  { phone: '18333966217', pass: '123456' },
  { phone: '18382394514', pass: '123456' },
  { phone: '18629896680', pass: '123456' } ]

let accountPath = process.argv[2];
if(accountPath != undefined){
  originPhones = require(accountPath);
}
let index = 0;
function start() {
  let user = originPhones[index];
  if(!user){
    logger.info("全部登录完成");
    console.log(JSON.stringify(originPhones,null, 4));
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);
  let scopeJar = "";
  proxy.switchIp().then(() => {
    return MaotaiService.getCurrentJar(user.phone);
  }).then(jar => {
    scopeJar = jar;
    return MaotaiService.getAddressId(user.phone, scopeJar);
  }).then(addressId => {
    originPhones[index].addressId = addressId;
    index++;
    start();
  })
  .catch(e => {
    index++;
    start();
    console.log(e.message);
  })
}


start()
