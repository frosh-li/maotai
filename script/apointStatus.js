/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const proxy = require('../controllers/proxy.js');
const MaotaiService = require('../tools/service');
let _phones = [
  "15249625137",
  "15046846298",
  "18903188059",
  "13670589613",
  "13792080758",
  "13624666057",
  "15935492346",
  "13191162477",
  "15613794675",
]


originPhones = require("../beijingaccount.json");

// var originPhones = require("../accounts.json");
// let shopName = '集玉进出口';
// if(cookieAddress == "001"){
//   quantity = 12;
// }
// if(cookieAddress == "002"){
//   // 猪小弟 两单
//   originPhones = require("../accounts/zhuxiaodi.json");
//   shopName = '七里河区';
//   // const originPhones = require("../accounts/zhuxiaodi2.json");
//   // let shopName = '甘南路';
// }
//
// if(cookieAddress == "003"){
//   // 猪小弟 两单
//   originPhones = require("../accounts/zhuxiaodi2.json");
//   shopName = '甘南路';
//   // const originPhones = require("../accounts/zhuxiaodi2.json");
//   // let shopName = '甘南路';
// }
//
// if(cookieAddress == "004"){
//   // 张先生10单
//   originPhones = require("../accounts/zhang.json");
//   shopName = '北京路贵州饭店';
// }
// if(cookieAddress == "005"){
//   //猫咪
//   originPhones = [{"phone":"13523472132", 'pass':"abcdef7758521"},{"phone":"18037798213", 'pass':"abcdef7758521"},];
//   shopName = '紫薇尚层';
// }
// originPhones = [{"phone":"13523472132", 'pass':"abcdef7758521"},{"phone":"18037798213", 'pass':"abcdef7758521"}];
let tels = [];
originPhones.forEach(data => {
  tels.push(JSON.stringify(data));
})
tels = tels.join("|");

logger.info('to Buy tels', originPhones);
let pid = '391';
let quantity = 6;
let statusResults = [];
let successAcount = [];
let failAccount = [];
function getStatus(){
  let phone = originPhones.shift();
  if(!phone){
    logger.info("检查完成");
    console.log("预约成功列表如下");
    console.log(JSON.stringify(successAcount));
    console.log("预约失败列表如下");
    console.log(JSON.stringify(failAccount));
    console.log(statusResults);
    return;
  }
  logger.info('start to check status', phone);
  let userAgent = MaotaiService.userAgent(phone.phone);
  proxy.switchIp.then(() => {
    MaotaiService.login(phone.phone, phone.pass, userAgent)
      .then(() => {
          return MaotaiService.apointStatus(userAgent);
      })
      .then(data => {
        console.log(JSON.stringify(data.dataObj))
        statusResults.push({
          receiver: data.receiver,
          address: data.address,
          reviewTime: data.reviewTime,
          status: data.status,
        });
        getStatus();
      })
      .catch(e => {
        logger.error(e);
        getStatus();
      })
  }).catch(e => {
    logger.error("代理切换失败", e);
    getStatus()
  })
}
getStatus()
