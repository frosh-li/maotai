/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const fs = require('fs');
const colors = require('colors/safe');
const request = require('request');
const proxy = require('./proxy');
const Utils = require('../services/utils');

logger.info('params', process.argv);

let checkInterval = 60*1000;
if(process.env.interval){
  checkInterval = process.env.interval*1000;
}
// 上海购买
// 地址信息
let pid = '391';
let quantity = 6;


let shopName = '东柏街|祥瑞丰源|SOHO现代城C|嘉禾国信大厦|西城区|文峰商贸';

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
var scanindex = 0
function watchQuanity(number) {
  if(scanindex > fixedShopId.length -1){
    scanindex = 0;
  }
  let shopId = fixedShopId[scanindex];
  let tel = 15844660602;//originPhones[randomIndex].phone;
  // let tel = "13720689056";
  let pass = 'a123456';//originPhones[randomIndex].pass;
  // let pass = "a123456";
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = 2024277;//originPhones[randomIndex].addressId;
  proxy.switchIp().then(() => {
    let _startTime = +new Date();
    let createOrderStartTime = +new Date();
    let currentJar = null;
    MaotaiService.getCurrentJar(tel)
        .then(j => {
          currentJar = j;
          _startTime = +new Date();
          return MaotaiService.createOrderByScan({
            phone: tel,
            pass: pass,
            addressId: scopeAddress
          }, pid, quantity,300, userAgent, scopeAddress, shopId, -1, currentJar)
        }).then( data => {
            logger.info("下单时间"+(new Date() - _startTime)+"ms");
            logger.info("订单提交耗时"+(new Date() - createOrderStartTime)+"ms");
            if(data.code === 0){
              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              process.exit(0);
              return;
            }
            setTimeout(() => {
                 scanindex++
                  watchQuanity(number);
            }, checkInterval);
        }).catch(e => {
            logger.info("位置错误,60秒后重试", e.message);
            setTimeout(() => {
              scanindex++;
                watchQuanity(number);
            }, checkInterval);
        })
  })
  .catch(e => {
    logger.error(e);
  })
}

//var fixedShopId = 233330186001; // 杭州网点
var fixedShopId = [ '111110105002',
    '111110105007',
    '111110105008',
    '111110105009',
    '111110105010',
    '111110105011',
    '111110105012',
    '111110105013',
    '111110105014',
    '111110105015',
    '211110105001',
    '211110105002',
    '211110105003',
    '211110105004',
    '211110105005',
    '211110105006',
    '211110105007',
    '211110105008',
    '211110105009',
    '211110105010',
    '211110105012',
    '211110105013',
    '211110105014',
    '211110105015',
    '211110105016',
    '211110105017',
    '211110105018',
    '211110105019',
    '211110105020' ];
var maxOrder = 10;
var successOrder = 0;
watchQuanity(10)
