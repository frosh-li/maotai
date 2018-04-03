/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const fs = require('fs');
const colors = require('colors/safe');
const Utils = require('../services/utils');
const request = require('request');
const proxy = require('../controllers/proxy');

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

function watchQuanity() {
  let randomIndex = Math.floor(Math.random()*(originPhones.length-1));
  let tel = originPhones[randomIndex].phone;
  // let tel = "13720689056";
  let pass = originPhones[randomIndex].pass;
  // let pass = "a123456";
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = "";
  let currentShopId = "";
  let currentJar = "";
  proxy.switchIp().then(() => {
    MaotaiService.getCurrentJar(tel)
        .then(j => {
            currentJar = j;
            return MaotaiService.getAddressId(tel,j)
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
              currentShopId = data.lbsdata.network.Sid;
              logger.info(colors.green("商家已经上货，开始购买流程"));
              printInfo(data);
              return MaotaiService.createOrderByScan(tel, pid , data.lbsdata.data.limit.LimitCount,data.lbsdata.data.stock.StockCount, userAgent, scopeAddress, data.lbsdata.data.network.Sid,-1,currentJar);
            }else {
              printInfo(data);
              return Promise.resolve({code: 500});
            }

          } else {
            logger.info(colors.green("您所在区域无法购买"))
            return Promise.resolve({code: 500});
          }
        }).then( data => {
          // var fixedShopId = 233330186001; // 杭州网点
          // var maxOrder = 13;
          // var successOrder = 0;
            // autoBuyFixedShop(233330186001, 13, 0, 100, 6);
            // return
            if(data && data.data && data.data.code === 0){
              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `${tel} ${pass}`, {flag:'a+'});
              originPhones.splice(randomIndex, 1)
              if(data.StockCount - data.buyLimit >= quantity){
                // 如果剩余还有可以购买的，继续购买
                // 先停止，开始批量定点购买流程
                let maxOrder = Math.floor((data.StockCount - buyLimit)/buyLimit);
                autoBuyFixedShop(currentShopId, maxOrder, 0, data.StockCount, data.buyLimit);
                return;
              }
            }else{
              setTimeout(() => {
                  watchQuanity();
              }, checkInterval);
            }

        }).catch(e => {
            logger.info("位置错误,60秒后重试", e);
            setTimeout(() => {
                watchQuanity();
            }, checkInterval);
        })
  })
  .catch(e => {
    logger.error(e);
  })
}

function autoBuyFixedShop(fixedShopId, maxOrder, successOrder, StockCount, buyLimit) {
  let randomIndex = Math.floor(Math.random()*(originPhones.length-1));
  let tel = originPhones[randomIndex].phone;
  // let tel = "13720689056";
  let pass = originPhones[randomIndex].pass;
  // let pass = "a123456";
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = "";
  if(successOrder >= maxOrder){
    console.log('购买完成,继续全量扫描');
    setTimeout(() => {
      watchQuanity();
    }, checkInterval);
    return;
  }
  proxy.switchIp().then(() => {
    let _startTime = +new Date();
    let currentJar = null;
    MaotaiService.getCurrentJar(tel)
        .then(j => {
          currentJar = j;
          return MaotaiService.getAddressId(tel, currentJar)
        })
        .then(address => {
          scopeAddress = address;
          return MaotaiService.createOrderByScan(
            tel,
            pid ,
            buyLimit,
            StockCount,
            userAgent,
            scopeAddress,
            fixedShopId,
            -1,
            currentJar);
        }).then( data => {
            logger.info("下单时间"+(new Date() - _startTime)+"ms");
            if(data.data.code === 0){

              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              successOrder++;
              fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `${tel} ${pass}`, 'a+');
              originPhones.splice(randomIndex, 1)
            }
            setTimeout(() => {
                  autoBuyFixedShop(fixedShopId, maxOrder, successOrder, StockCount, buyLimit);
            }, checkInterval);
        }).catch(e => {
            logger.info("位置错误,60秒后重试", e);
            setTimeout(() => {
                autoBuyFixedShop(fixedShopId, maxOrder, successOrder, StockCount, buyLimit);
            }, checkInterval);
        })
  })
  .catch(e => {
    logger.error(e);
  })
}

// var fixedShopId = 233330186001; // 杭州网点
// var maxOrder = 13;
// var successOrder = 0;

// let interval = setInterval(() => {
//   let now = new Date();
//   let Hour = now.getHours();
//   logger.trace('当前时间:', Hour);
//   if(Hour >= 10 && Hour <= 16) {
//     clearInterval(interval);
//     logger.info('抢购时间开始');
//     // todo
//     // 去掉每次都登陆的逻辑，登陆一次就开始监控，只需要刷新lbs接口即可
//     watchQuanity();
//   }else{
//     logger.trace('继续等待中，等到十点才开始吧');
//   }
// }, 2000);

watchQuanity();
