/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const proxy = require('../controllers/proxy.js');
const MaotaiService = require('../tools/service');

const fs = require('fs');


originPhones = require("../accounts/apoint4.5.hangzhou.json");
originPhones = [{"phone":"13414570045","pass":"wy40324700","addressId":1994066},{"phone":"13650493675","pass":"wy40324700","addressId":1993819},{"phone":"15999759990","pass":"wy40324700","addressId":1994049},{"phone":"13267540771","pass":"wy40324700","addressId":1937801},{"phone":"18825752409","pass":"wy40324700 ","addressId":1991338},{"phone":"15818274155","pass":"wy40324700","addressId":1807547},{"phone":"13412214599","pass":"wy40324700","addressId":1994746},{"phone":"13267574337","pass":"wy40324700","addressId":1994766},{"phone":"18681019002","pass":"wy40324700"},{"phone":"13128074637","pass":"wy40324700","addressId":1862125},{"phone":"15934570100","pass":"3122@yang ","addressId":1839988},{"phone":"13192054067","pass":"wy40324700","addressId":1994821},{"phone":"13267549137","pass":"wy40324700","addressId":1994835},{"phone":"13537418590","pass":"wy40324700"},{"phone":"13886972253","pass":"wy40324700","addressId":1994862},{"phone":"18199743397","pass":"wy40324700","addressId":1994875},{"phone":"15015247207","pass":"wy40324700","addressId":1994894},{"phone":"15089493032","pass":"wy40324700","addressId":1866321},{"phone":"13650842112","pass":"wy40324700","addressId":1994904}];
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
    console.log("预约失败列表如下");
    console.log(JSON.stringify(failAccount));
    return;
  }
  logger.info('start to check status', phone);
  let userAgent = MaotaiService.userAgent(phone.phone);
  proxy.switchIp().then(() => {
    let scopeJar = "";
    MaotaiService.getCurrentJar(phone.phone)
      .then((j) => {
          scopeJar = j;
          return MaotaiService.apointStatus(userAgent, j);
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
