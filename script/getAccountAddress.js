/**
 * 获取账号的地址信息
 * 
 * @type {[type]}
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const proxy = require('../controllers/proxy');

var originPhones = 
  [{"phone":"18096000082","pass":"cc008266"},
    {"phone":"15710837069","pass":"wy40324700"},
    {"phone":"15217384278","pass":"wy40324700"},
    {"phone":"13713276696","pass":"wy40324700"},
    {"phone":"15766365054","pass":"wy40324700"},
    {"phone":"13650318022","pass":"wy40324700"},
    {"phone":"18890706557","pass":"wy40324700"},
    {"phone":"18219910361","pass":"052020"},
    {"phone":"13325332463","pass":"lw521521521"},
    {"phone":"18082201076","pass":"3122@yang"},
    {"phone":"18234760660","pass":"3122@yang"}];
let index = 0;
function start() {
  let user = originPhones[index];
  if(!user){
    logger.info("全部登录完成");
    console.log(JSON.stringify(originPhones));
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
