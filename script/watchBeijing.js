/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const sendmsg = require('../sendmsg/');
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

//var originPhones = require("../accounts/apoint4.5.hangzhou.json");
var originPhones = [{"phone":"19923800479","pass":"123456","addressId":1985973},{"phone":"17688225696","pass":"123456","addressId":1985969},{"phone":"18580067873","pass":"123456","addressId":1985985},{"phone":"15123922379","pass":"123456","addressId":1986003},{"phone":"13212382391","pass":"776800868h","addressId":1929891},{"phone":"17323972656","pass":"123456","addressId":1933999},{"phone":"18323215176","pass":"123456","addressId":1937925},{"phone":"19923736324","pass":"123456","addressId":1937822},{"phone":"15102335828","pass":"123456","addressId":1929918}];

originPhones = originPhones.concat([{"phone":"13414570045","pass":"wy40324700","addressId":1994066},{"phone":"13650493675","pass":"wy40324700","addressId":1993819},{"phone":"15999759990","pass":"wy40324700","addressId":1994049},{"phone":"13267540771","pass":"wy40324700","addressId":1937801},{"phone":"18825752409","pass":"wy40324700 ","addressId":1991338},{"phone":"15818274155","pass":"wy40324700","addressId":1807547},{"phone":"13412214599","pass":"wy40324700","addressId":1994746},{"phone":"13267574337","pass":"wy40324700","addressId":1994766},{"phone":"18681019002","pass":"wy40324700"},{"phone":"13128074637","pass":"wy40324700","addressId":1862125},{"phone":"13192054067","pass":"wy40324700","addressId":1994821},{"phone":"13267549137","pass":"wy40324700","addressId":1994835},{"phone":"13537418590","pass":"wy40324700"},{"phone":"13886972253","pass":"wy40324700","addressId":1994862},{"phone":"18199743397","pass":"wy40324700","addressId":1994875},{"phone":"15015247207","pass":"wy40324700","addressId":1994894},{"phone":"15089493032","pass":"wy40324700","addressId":1866321},{"phone":"13650842112","pass":"wy40324700","addressId":1994904}])
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
  let pass = originPhones[randomIndex].pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = originPhones.addressId;
  let currentShopId = "";
  let currentJar = "";
  proxy.switchIp().then(() => {
    MaotaiService.getCurrentJar(tel)
        .then(j => {
            currentJar = j;
            return MaotaiService.LBSServer(scopeAddress, tel, userAgent,pid, currentJar);
        })
        .then(data => {
          if (data !=undefined && data.lbsdata != undefined && data.lbsdata.data != undefined && data.lbsdata.data.stock !=undefined && data.lbsdata.data.stock.Sid != undefined) {
            logger.info("库存信息",data.lbsdata.data.stock)
            logger.info("限购信息", data.lbsdata.data.limit)
            logger.info("商家信息", data.lbsdata.data.network)
            if(
              data.lbsdata.data.stock.StockCount >= quantity
              &&
              data.lbsdata.data.limit.LimitCount >= quantity
            ){
              currentShopId = data.lbsdata.network.Sid;
              logger.info(colors.green("商家已经上货，开始购买流程"));
              sendmsg('15330066919', '商家已经上货'+currentShopId+":"+data.lbsdata.data.stock.StockCount);
              printInfo(data);
              return MaotaiService.createOrderByScan(tel, pid , data.lbsdata.data.limit.LimitCount,data.lbsdata.data.stock.StockCount, userAgent, scopeAddress, data.lbsdata.data.network.Sid,-1,currentJar);
            }else {
              printInfo(data);
              logger.info('不满足购买条件');
              return Promise.resolve({code: 500});
            }

          } else {
            logger.info(colors.green("您所在区域暂未上货"))
            logger.info(scopeAddress, JSON.stringify(data.lbsdata));
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
            logger.info("位置错误,60秒后重试", e.message);
            setTimeout(() => {
                watchQuanity();
            }, checkInterval);
        })
  })
  .catch(e => {
    logger.error(e);
            setTimeout(() => {
                watchQuanity();
            }, checkInterval);
  })
}

function autoBuyFixedShop(fixedShopId, maxOrder, successOrder, StockCount, buyLimit) {
  let randomIndex = Math.floor(Math.random()*(originPhones.length-1));
  let tel = originPhones[randomIndex].phone;
  let pass = originPhones[randomIndex].pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = originPhones[randomIndex].addressId;
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

let interval = setInterval(() => {
  let now = new Date();
  let Hour = now.getHours();
  logger.trace('当前时间:', Hour);
  if(Hour >= 10 && Hour <= 16) {
    clearInterval(interval);
    logger.info('抢购时间开始');
    // todo
    // 去掉每次都登陆的逻辑，登陆一次就开始监控，只需要刷新lbs接口即可
    watchQuanity();
  }else{
    logger.trace('继续等待中，等到十点才开始吧');
  }
}, 2000);

// watchQuanity();

