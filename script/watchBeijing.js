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

var originPhones = require("../accounts/4.10.json");



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
  let scopeAddress = originPhones[randomIndex].addressId || 1937801;
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
              currentShopId = data.lbsdata.data.network.Sid;
              logger.info(colors.green("商家已经上货，开始购买流程"));
              printInfo(data);
              logger.info('scopeAddress', scopeAddress);
              return MaotaiService.createOrderByScan(originPhones[randomIndex], pid , data.lbsdata.data.limit.LimitCount,data.lbsdata.data.stock.StockCount, userAgent, scopeAddress, data.lbsdata.data.network.Sid,-1,currentJar);
            }else {
              printInfo(data);
              logger.info('不满足购买条件');
              logger.info(JSON.stringify(originPhones[randomIndex]))
              return Promise.resolve({code: 500});
            }

          } else {
            logger.info(colors.green("您所在区域暂未上货"))
              logger.info(JSON.stringify(originPhones[randomIndex]))
            logger.info(scopeAddress, JSON.stringify(data.lbsdata));
            return Promise.resolve({code: 500});
          }
        }).then( data => {
          // 只要抢购成功就进行异步查验是否购买到了
            if(data && data.data && data.data.code === 0){
              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `${tel} ${pass}\n`, {flag:'a+'});
              originPhones.splice(randomIndex, 1)
            }
            
            setTimeout(() => {
                watchQuanity();
            }, checkInterval);
            

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

function buyCheck(tel, pass, scopeAddress) {
  let userAgent = MaotaiService.userAgent(tel);
  proxy.switchIp()
      .then(() => {
        let currentJar = null;
        return MaotaiService.getCurrentJar(tel)
      }).then(j => {
        currentJar = j;
        return MaotaiService.createOrderByScan(
          tel,
          pid,
          6,
          100,
          userAgent,
          scopeAddress,
          fixedShopId,
          -1,
          currentJar
        )
      }).then(data => {
        if(data.data.code === 0 ){
          logger.info('购买成功'+tel+":"+pass+","+JSON.stringify(data));
        }else{
          logger.error('购买失败'+JSON.stringify(data));
          logger.info('60s后重试');
          setTimeout(() => {
            buyCheck(tel, pass, scopeAddress);
          }, 60000);
        }
      }).catch(e => {
        logger.error('购买失败'+e.message);
          logger.info('60s后重试');
          setTimeout(() => {
            buyCheck(tel, pass, scopeAddress);
          }, 60000);
      })
}

var fixedShopId = 250500105007; // 杭州网点
var maxOrder = 20;
var successOrder = 0;
//{"phone":"19923800479","pass":"123456","addressId":1985973},
//buyCheck('19923800479', '123456',  1985973);
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

