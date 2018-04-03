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
  let scopeAddress = "";
  if(successOrder >= maxOrder){
    console.log('购买完成')
    return;
  }
  proxy.switchIp().then(() => {
    MaotaiService.login(tel, pass, userAgent)
        .then(data => {
            return MaotaiService.getAddressId(tel)
        })
        .then(address => {
          scopeAddress = address;
          return MaotaiService.createOrder(tel, pid , 6, userAgent, scopeAddress, fixedShopId);
        }).then( data => {
            if(data.code === 0){
              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              successOrder++;
              fs.writeFileSync("output/20180403.json", `${tel} ${pass}`, 'a+');
              originPhones.splice(randomIndex, 1)
            }
            setTimeout(() => {
                  watchQuanity(number);
            }, checkInterval);
        }).catch(e => {
            logger.info("位置错误,60秒后重试", e);
            setTimeout(() => {
                watchQuanity(number);
            }, checkInterval);
        })
  })
  .catch(e => {
    logger.error(e);
  })
}

var fixedShopId = 211110105001;
var maxOrder = 5;
var successOrder = 0;


watchQuanity(number)


