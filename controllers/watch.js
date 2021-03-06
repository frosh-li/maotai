/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const fs = require('fs');
const colors = require('colors/safe');
const request = require('request');
const proxy = require('./proxy');

logger.info('params', process.argv);
// cookie path
let cookieAddress = process.argv[2];
if(cookieAddress){
  fs.writeFileSync("cookies/"+cookieAddress+".json", '');
  MaotaiService.initCookiePath(cookieAddress);
}
let checkInterval = 1*1000;
// 上海购买
// 地址信息
let pid = '391';
let quantity = 6;


let shopName = '东柏街|祥瑞丰源|SOHO现代城C|嘉禾国信大厦|西城区|文峰商贸';
var originPhones = require("../beijing4.2buy.json");
// originPhones = [
  
//   {"phone":"15039298864","pass":"a123456"},
//   {"phone":"13839228541","pass":"a123456"},
  
//   {"phone":"15257918657","pass":"a123456"},
//   {"phone":"18331375226","pass":"a123456"}
// ]
originPhones = [
  {"phone":"13618484713","pass":"zxcvbnm"},
  {"phone":"17753583852","pass":"123456"},
  {"phone":"15213163729","pass":"123456"},
  {"phone":"17783920137","pass":"xqh19950703"},

  {"phone":"18236877936","pass":"wxp800614"},
  {"phone":"15178421370","pass":"2016whczg"},
  {"phone":"15084425825","pass":"lh25802580"},
  {"phone":"17772324023","pass":"lh25802580"},
  {"phone":"13786958413","pass":"58585858"},

  {"phone":"13711949575","pass":"wy40324700"},
  {"phone":"13686135579","pass":"wy40324700"},
  {"phone":"15717350785","pass":"dyj395799."},
  {"phone":"18273181619","pass":"dyj395799."},
]
function printInfo(data){
  try{
    logger.info('推送网点信息');
    logger.info("Address:", data.lbsdata.data.network.Address)
    logger.info("SName:", data.lbsdata.data.network.SName)
    logger.info("DName:", data.lbsdata.data.network.DName)
    logger.info("SID:", data.lbsdata.data.stock.Sid);
    logger.info("total:",data.lbsdata.data.stock.StockCount)
    logger.info("limit:", data.lbsdata.data.limit.LimitCount)
  }catch(e){
    logger.error(e);
  }
}


function fixShop(network, shopName) {
  let result = false;
  let allShopNames = shopName.split("|");
  logger.info(allShopNames);
  allShopNames.forEach(item=>{
    if(
        network.SName.indexOf(item) > -1
        ||
        network.DName.indexOf(item) > -1
        ||
        network.Address.indexOf(item) > -1
        ){
      result = true;
    }
  })
  return result;
}

function watchQuanity(shopName) {
  let randomIndex = Math.floor(Math.random()*(originPhones.length-1));
  let tel = originPhones[randomIndex].phone;
  // let tel = "13720689056";
  let pass = originPhones[randomIndex].pass;
  // let pass = "a123456";
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = "";
  proxy.switchIp().then(() => {
    MaotaiService.login(tel, pass, userAgent)
        .then(data => {
            if(originPhones[randomIndex].addressId){
              return new Promise((resolve, reject) => {
                resolve(originPhones[randomIndex].addressId);
              })
            }else{
              return MaotaiService.getAddressId(tel)  
            }
        })
        .then(address => {
            scopeAddress = address;
            originPhones[randomIndex].addressId = address;
            return MaotaiService.LBSServer(address, tel, userAgent);
        })
        .then(data => {
          if (data && data.lbsdata && data.lbsdata.data && data.lbsdata.data.stock && data.lbsdata.data.stock.Sid) {
            if(
              data.lbsdata.data.stock.StockCount >= quantity
              &&
              data.lbsdata.data.limit.LimitCount >= quantity
            ){
              logger.info(colors.green("商家已经上货，开始购买流程"));
              printInfo(data);
              return MaotaiService.createOrder(tel, pid , data.lbsdata.data.limit.LimitCount, userAgent, scopeAddress, data.lbsdata.data.network.Sid);
            }else {
              printInfo(data);
              return Promise.resolve({code: 500});  
            }

          } else {
            logger.info(colors.green("您所在区域无法购买"))
            return Promise.resolve({code: 500});
          }
        }).then( data => {
            if(data.code === 0){
              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              fs.writeFileSync("output/20180403.json", `${tel} ${pass}`, 'a+');
              originPhones.splice(randomIndex, 1)
            }
            setTimeout(() => {
                  watchQuanity(shopName);
            }, checkInterval);
        }).catch(e => {
            logger.info("位置错误,60秒后重试", e);
            setTimeout(() => {
                watchQuanity(shopName);
            }, checkInterval);
        })
  })
  .catch(e => {
    logger.error(e);
  })
}

let interval = setInterval(() => {
  let now = new Date();
  let Hour = now.getHours();
  logger.trace('当前时间:', Hour);
  if(Hour >= 10 && Hour <= 16) {
    clearInterval(interval);
    logger.info('抢购时间开始');
    // todo
    // 去掉每次都登陆的逻辑，登陆一次就开始监控，只需要刷新lbs接口即可
    watchQuanity(shopName);
  }else{
    logger.trace('继续等待中，等到十点才开始吧');
  }
}, 2000);

