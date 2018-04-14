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

let checkInterval = 1*1000;
// 上海购买
// 地址信息
let pid = '391';
let quantity = process.argv[4] || 6;

let shopName = '东柏街|祥瑞丰源|SOHO现代城C|嘉禾国信大厦|西城区|文峰商贸';
var originPhones = JSON.parse(process.argv[3]);
var fixedShopId = process.argv[2]; //双龙网点
var rewriteFilePath = process.argv[5];

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


function buyChild(number) {
  let tel = originPhones.phone;
  let pass = originPhones.pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = originPhones.addressId;
  let _startTime = +new Date();
  let createOrderStartTime = +new Date();
  let currentJar = null;
  MaotaiService.getCurrentJar(tel)
      .then(j => {
        currentJar = j;
        _startTime = +new Date();
        return MaotaiService.createOrderByScan(originPhones, pid, quantity,300, userAgent, scopeAddress, fixedShopId, -1, currentJar)
        //return MaotaiService.createOrderByScan(tel, pid , 6, userAgent, scopeAddress, fixedShopId, currentJar);
      }).then( data => {
          logger.info("下单时间"+(new Date() - _startTime)+"ms");
          logger.info("订单提交耗时"+(new Date() - createOrderStartTime)+"ms");
          console.log(data, typeof data);
          if(data.data !=undefined && data.data.code != undefined && data.data.code === 0){
            // 购买成功，进行下一个账号的处理逻辑
            logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
            let sendProcess = process.send({
              code: 'buy_done',
              tel: tel,
              filepath: rewriteFilePath
            });
            console.log('通知主进程购买完成', sendProcess);
            fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `${tel} ${pass}`, {flag:'a+'});
            process.exit(0);
          }
      }).catch(e => {
          logger.info("位置错误,60秒后重试", e.message);
          process.send({
            status: false
          });
          process.exit(0);
      })
}

buyChild();
