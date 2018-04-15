/**
 * 监控某一个站点是否已经可以抢货了
 */


var logger = require('../controllers/logger.js');

const MaotaiService = require('../tools/service');
const sendmsg = require('../sendmsg/');
const fs = require('fs');
const colors = require('colors/safe');
const Utils = require('../services/utils');
const request = require('request');
const proxy = require('../controllers/proxy');
const networks = require('../accounts/watchNetwork.json');
const filterNetworks = require('../filterNetwork.json');
let checkInterval = 1*1000;
// 上海购买
// 地址信息
let pid = '391';
let quantity = 6;


let shopName = '东柏街|祥瑞丰源|SOHO现代城C|嘉禾国信大厦|西城区|文峰商贸';

let originPhones = (require("../accounts/gansu_ganlanlu.json"));
originPhones = originPhones.concat(require("../accounts/gansu_huoxingjie.json"));
originPhones = originPhones.concat(require("../accounts/gansu_jinninglu.json"));
originPhones = originPhones.concat(require("../accounts/qiaoge.json"));
originPhones = originPhones.concat(require("../accounts/guiyang.json"));
let canBuyFixed = false;
if(process.argv[2] != undefined){
  originPhones = require(process.argv[2]);
  canBuyFixed = true;
}
var scanindex = 0
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
  if(originPhones.length === 0){
    console.log('改地区已经无账号，全部购买完成');
    return;
  }
  if(scanindex > originPhones.length-1){
    scanindex=0;
  }
  let randomIndex = scanindex;//Math.floor(Math.random()*(originPhones.length-1));
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
          // data = {
          //   lbsdata: {
          //     data: {
          //       stock: {
          //         StockCount: 24,
          //         Sid: 111110105009
          //       },
          //       limit: {
          //         LimitCount: 6
          //       },
          //       network: {
          //         Sid:111110105009,
          //         Address:"通州区",
          //         SName:"百度",
          //         DName: "百度"
          //       }
          //     }
          //   }
          // };

          if (data !=undefined && data.lbsdata != undefined && data.lbsdata.data != undefined && data.lbsdata.data.stock !=undefined && data.lbsdata.data.stock.Sid != undefined) {
            if(
              data.lbsdata.data.stock.StockCount >= quantity
              &&
              data.lbsdata.data.limit.LimitCount >= quantity
            ){
              currentShopId = data.lbsdata.data.network.Sid;
              logger.info(colors.green("商家已经上货，开始购买流程"));
              printInfo(data);
              if(filterNetworks.indexOf(currentShopId.toString()) > -1){
                setTimeout(() => {
                    scanindex++;
                    watchQuanity();
                }, checkInterval);
                return; 
              } 
              let buyAccount = quantity;
              let _limitCount =  data.lbsdata.data.limit.LimitCount;
              let _stock =  data.lbsdata.data.stock.StockCount;
              buyAccount = _limitCount <= _stock ? _limitCount : Math.floor(_stock/quantity)*quantity;
              logger.info('实际购买数量', buyAccount, "库存",_stock,"限购", _limitCount);
              let totals = Math.floor((_stock)/buyAccount);
              if(totals > 0){
                let msg = {
                  code:"startBuy",
                  currentShopId: currentShopId,
                  stock: _stock,
                  totals: totals,
                  limitCount: buyAccount,
                  accounts: originPhones,
                  filepath: process.argv[2]
                };
                logger.info('send to main process to by', msg);
                let sendmsgtomain = process.send(msg); // 发送消息给父进程暂停所有监控
                console.log("发送消息给主进程", sendmsgtomain?"成功":"失败");
                // processManager.closeAllChild();
                // 关闭进程，让go处理完成后重新发送http请求开启进程
              }else{
                setTimeout(() => {
                    scanindex++;
                    watchQuanity();
                }, checkInterval);
              }

              //return MaotaiService.createOrderByScan(originPhones[randomIndex], pid , buyAccount,data.lbsdata.data.stock.StockCount, userAgent, scopeAddress, data.lbsdata.data.network.Sid,-1,currentJar);
            }else{
              printInfo(data);
              logger.info('不满足购买条件');
              logger.info(JSON.stringify(originPhones[randomIndex]))
              setTimeout(() => {
                  scanindex++;
                  watchQuanity();
              }, checkInterval);
            }
          } else {
            logger.info(JSON.stringify(originPhones[randomIndex]))
            logger.info(scopeAddress, JSON.stringify(data.lbsdata));
            setTimeout(() => {
                scanindex++;
                watchQuanity();
            }, checkInterval);
            // return Promise.resolve({code: 500});
          }

        // }).then( data => {
        //   // 只要抢购成功就进行异步查验是否购买到了
        //     if(data && data.data && data.data.code === 0){
        //       // 购买成功，进行下一个账号的处理逻辑
        //       logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
        //       fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `\n${tel} ${pass} ${new Date()} ${currentShopId}`, {flag:'a+'});
        //       originPhones.splice(randomIndex, 1)
        //     }
        //
        //     setTimeout(() => {
        //         scanindex++;
        //         watchQuanity();
        //     }, checkInterval);
        //

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
        watchQuanity();
    }, checkInterval);
  })
}
var maxOrder = 5;
var successOrder = 0;


var fixedShopId = 250500105007; // 杭州网点
//{"phone":"19923800479","pass":"123456","addressId":1985973},
//buyCheck('19923800479', '123456',  1985973);
let interval = setInterval(() => {
  let now = new Date();
  let Hour = now.getHours();
  logger.trace('当前时间:', Hour);
  //if(Hour >= 10 && Hour <= 24) {
    clearInterval(interval);
    logger.info('抢购时间开始');
    // todo
    // 去掉每次都登陆的逻辑，登陆一次就开始监控，只需要刷新lbs接口即可
    watchQuanity();
  // }else{
  //   logger.trace('继续等待中，等到十点才开始吧');
  // }
}, 2000);
