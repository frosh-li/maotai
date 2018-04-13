/**
 * 获取账号的地址信息
 *
 * @type {[type]}
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const proxy = require('../controllers/proxy');
const fs = require('fs');
const path = require('path');
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
    fs.writeFileSync(path.resolve(__dirname,process.argv[2]), JSON.stringify(originPhones, null, 4));
    return;
  }
  if(user.addressId){
    logger.info('存在地址不需要再去获取了');
    index++;
    return start();
  }
  let userAgent = MaotaiService.userAgent(user.phone);
  let scopeJar = "";
  proxy.switchIp().then(() => {
      console.log("start")
    return MaotaiService.getCurrentJar(user.phone);
  }).then(jar => {
    scopeJar = jar;
    console.log(jar);
    return MaotaiService.getAddressId(user.phone, scopeJar);
  }).then(addressId => {
    originPhones[index].addressId = addressId;
    index++;
    start();
  })
  .catch(e => {
    // 网络出错继续尝试
    console.log(e.message);
    start();

  })
}


start()
