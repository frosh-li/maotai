/**
 * 购买云商总部获取
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const fs = require('fs');
const colors = require('colors/safe');
const request = require('request');
const proxy = require('./proxy');
const Utils = require('../services/utils');

// 上海购买
// 地址信息
let pid = '391';
let quantity = 5;

var originPhones = require(process.argv[3]);
var fixedShopId = process.argv[2]; //双龙网点

let index = 0;
function buyChild(number) {
  let account = originPhones[index];
  let tel = account.phone;
  let pass = account.pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = account.addressId;
  let _startTime = +new Date();
  let createOrderStartTime = +new Date();
  let currentJar = null;
  MaotaiService.getCurrentJar(tel)
      .then(j => {
        currentJar = j;
        _startTime = +new Date();
        return MaotaiService.createOrderByScan(account, pid, quantity,300, userAgent, scopeAddress, fixedShopId, -1, currentJar)
      }).then( data => {
          logger.info("下单时间"+(new Date() - _startTime)+"ms");
          logger.info("订单提交耗时"+(new Date() - createOrderStartTime)+"ms");
          console.log(data, typeof data);
          if(data.data !=undefined && data.data.code != undefined && data.data.code === 0){
            // 购买成功，进行下一个账号的处理逻辑
            logger.info('购买成功'+tel+":"+pass+JSON.stringify(data));
            fs.writeFileSync(`output/${Utils.dateFormat()}_jiangsu.json`, `${tel} ${pass} ${fixedShopId} ${new Date()}\n`, {flag:'a+'});
            intervalBuy();
          }
      }).catch(e => {
          logger.info("位置错误,60秒后重试", e.message);
          intervalBuy();
      })
}

function intervalBuy(){
  index++;
  setTimeout(() => {
    buyChild();
  }, 1000);
}

buyChild();
