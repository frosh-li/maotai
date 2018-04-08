/**
 * 获取账号的地址信息
 * 
 * @type {[type]}
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const proxy = require('../controllers/proxy');

var originPhones = [{"phone":"13414570045","pass":"wy40324700"},
  {"phone":"13650493675","pass":"wy40324700"},
  {"phone":"15999759990","pass":"wy40324700"},
  {"phone":"13267540771","pass":"wy40324700"},
  {"phone":"18825752409","pass":"wy40324700 "},
  {"phone":"15818274155","pass":"wy40324700"},
  {"phone":"13412214599","pass":"wy40324700"},
  {"phone":"13267574337","pass":"wy40324700"},
  {"phone":"18681019002","pass":"wy40324700"},
  {"phone":"13128074637","pass":"wy40324700"},
  {"phone":"15934570100","pass":"3122@yang "},
  {"phone":"13192054067","pass":"wy40324700"},
  {"phone":"13267549137","pass":"wy40324700"},
  {"phone":"13537418590","pass":"wy40324700"},
  {"phone":"13886972253","pass":"wy40324700"},
  {"phone":"18199743397","pass":"wy40324700"},
  {"phone":"15015247207","pass":"wy40324700"},
  {"phone":"15089493032","pass":"wy40324700"},
  {"phone":"13650842112","pass":"wy40324700"},
  {"phone":"18312696005","pass":"wy40324700"}];
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
