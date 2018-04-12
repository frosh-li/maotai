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
const {exec} = require('child_process');

let shopName = '东柏街|祥瑞丰源|SOHO现代城C|嘉禾国信大厦|西城区|文峰商贸';

global.watchPhones = [
  {
    "phone": "13512856201",
      "pass": "wyp100721",
      "addressId": 1842614},
  {
    "phone": "15935492346",
        "pass": "a123456",
        "addressId": 1930788
  },
  {
  "phone": "13895490886",
        "pass": "a123456",
        "addressId": 1961951
  }
] 
if(process.argv[2] != undefined){
  global.originPhones = require(process.argv[2]);
}
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
var scanindex=0;
function watchQuanity() {
  if(scanindex > watchPhones.length -1){
    scanindex = 0;
  }
  let randomIndex = scanindex;//Math.floor(Math.random()*(originPhones.length-1));
  let tel = watchPhones[randomIndex].phone;
  let pass = watchPhones[randomIndex].pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = watchPhones[randomIndex].addressId;
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
              let buyAccount = data.lbsdata.data.limit.LimitCount >= data.lbsdata.data.stock ? data.lbsdata.data.limit.LimitCount : quantity;
              child = exec(`node ../controllers/buyFixed ${currentShopId} ${process.argv[2]}`)
              return; 
            }else {
              printInfo(data);
              logger.info('不满足购买条件');
              logger.info(JSON.stringify(watchPhones[randomIndex]))
              setTimeout(() => {
                scanindex++;
                  watchQuanity();
              }, checkInterval);
            }

          } else {
            setTimeout(() => {
              scanindex++;
                watchQuanity();
            }, checkInterval);
          }
        }).catch(e => {
            logger.info("位置错误,60秒后重试", e.message);
            setTimeout(() => {
              scanindex++;
                watchQuanity();
            }, checkInterval);
        })
  })
  .catch(e => {
    logger.error(e);
            setTimeout(() => {
              scanindex++;
                watchQuanity();
            }, checkInterval);
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
    watchQuanity();
  }else{
    logger.trace('继续等待中，等到十点才开始吧');
  }
}, 2000);
//watchQuanity();
