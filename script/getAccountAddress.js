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
