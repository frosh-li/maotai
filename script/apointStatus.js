/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const proxy = require('../controllers/proxy.js');
const MaotaiService = require('../tools/service');

const fs = require('fs');


originPhones = require("../beijing4.2buy.json");

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
  logger.info('还剩下'+originPhones.length+'个检测');
  if(!phone){
    logger.info("检查完成");
    console.log("预约成功列表如下");
    console.log(JSON.stringify(successAcount));
    fs.writeFileSync('./beijing4.2buy.successAcount.json', JSON.stringify(successAcount))
    console.log("预约失败列表如下");
    console.log(JSON.stringify(failAccount));
    fs.writeFileSync('./beijing4.2buy.failAccount.json', JSON.stringify(failAccount))
    return;
  }
  logger.info('start to check status', phone);
  let userAgent = MaotaiService.userAgent(phone.phone);
  proxy.switchIp().then(() => {
    MaotaiService.login(phone.phone, phone.pass, userAgent)
      .then(() => {
          return MaotaiService.apointStatus(userAgent);
      })
      .then(data => {
        if(data.status == 3){
          // 3位审核成功
          successAcount.push({
            phone: phone.phone,
            pass:phone.pass,
            address: data.address,
            registPhone: data.registPhone,
            receivePhone: data.receivePhone,
            reviewInfo:'',
          })
        }else{
          failAccount.push({
            phone: phone.phone,
            pass:phone.pass,
            address: data.address,
            registPhone: data.registPhone,
            receivePhone: data.receivePhone,
            reviewInfo:data.reviewInfo.split('。')[0],
          })
        }
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
