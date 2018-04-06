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
let quantity = 2;
// 13618484713+zxcvbnm
// 17753583852+123456
// 15213163729+123456
// 17783920137+xqh19950703
// 18236877936+wxp800614
// 15178421370+2016whczg
// 15084425825  lh25802580
// 17772324023  lh25802580
// 13786958413-58585858
// 13711949575----wy40324700
// 13686135579----wy40324700
// 15717350785——dyj395799.
// 18273181619——dyj395799.


let shopName = '东柏街|祥瑞丰源|SOHO现代城C|嘉禾国信大厦|西城区|文峰商贸';
var originPhones = require("../shuanglong.json");
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

function watchQuanity(number) {
  let randomIndex = Math.floor(Math.random()*(originPhones.length-1));
  let tel = originPhones[randomIndex].phone;
  // let tel = "13720689056";
  let pass = originPhones[randomIndex].pass;
  // let pass = "a123456";
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = originPhones[randomIndex].addressId;
  if(successOrder >= maxOrder){
    console.log('购买完成')
    return;
  }
  //proxy.switchIp().then(() => {
    let _startTime = +new Date();
    let createOrderStartTime = +new Date();
    let currentJar = null;
    MaotaiService.getCurrentJar(tel)
        .then(j => {
          currentJar = j;
          _startTime = +new Date();
          return MaotaiService.createOrderByScan(tel, pid, quantity,300, userAgent, scopeAddress, fixedShopId, -1, currentJar)
          //return MaotaiService.createOrderByScan(tel, pid , 6, userAgent, scopeAddress, fixedShopId, currentJar);
        }).then( data => {
            logger.info("下单时间"+(new Date() - _startTime)+"ms");
            logger.info("订单提交耗时"+(new Date() - createOrderStartTime)+"ms");
            if(data.code === 0){

              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              successOrder++;
              fs.writeFileSync("output/20180405.json", `${tel} ${pass}`, 'a+');
              originPhones.splice(randomIndex, 1)
            }
            setTimeout(() => {
                  watchQuanity(number);
            }, checkInterval);
        }).catch(e => {
            logger.info("位置错误,60秒后重试", e.message);
            setTimeout(() => {
                watchQuanity(number);
            }, checkInterval);
        })
  //})
  //.catch(e => {
  //  logger.error(e);
  //})
}

//var fixedShopId = 233330186001; // 杭州网点
var fixedShopId = 211110105003; //双龙网点 
var maxOrder = 20;
var successOrder = 0;
watchQuanity(20)


