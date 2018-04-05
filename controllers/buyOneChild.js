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

let checkInterval = 1*1000;
// 上海购买
// 地址信息
let pid = '391';
let quantity = 6;

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

function buy(tel, pass, addressId) {
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = addressId;
    let _startTime = +new Date();
    let createOrderStartTime = +new Date();
    let currentJar = null;
    if(retryTimes >=5){
      logger.info("连续五次无法正常下单，自动退出进程");
      process.exit(0);
    }
    MaotaiService.getCurrentJar(tel)
        .then(j => {
          currentJar = j;
          _startTime = +new Date();
          return MaotaiService.createOrderByScan(tel, pid, quantity = 6,300, userAgent, scopeAddress, fixedShopId, -1, currentJar)
        }).then( data => {
            logger.info("下单时间"+(new Date() - _startTime)+"ms");
            logger.info("订单提交耗时"+(new Date() - createOrderStartTime)+"ms");
            if(data.code === 0){
              // 购买成功，进行下一个账号的处理逻辑
              logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
              fs.writeFileSync("output/20180405.json", `${tel} ${pass}`, 'a+');
              process.exit(0);
            }
            setTimeout(() => {
                  process.exit(0);
                  buy(tel, pass, addressId);
                  retryTimes++;
            }, checkInterval);
        }).catch(e => {
            logger.info("位置错误,60秒后重试", e);
            setTimeout(() => {
                process.exit(0);
                buy(tel, pass, addressId);
                retryTimes++;
            }, checkInterval);
        })
}

var fixedShopId = 233330186001; // 杭州网点
var retryTimes = 0;
proxy.switchIp().then(data => {
  buy(process.argv[2], process.argv[3], process.argv[4]);  
})
.catch(e => {
  console.log(e.message);
})



