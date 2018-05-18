/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const fs = require('fs');
const colors = require('colors/safe');
const request = require('request');
const Utils = require('../services/utils');

logger.info('params', process.argv);

let checkInterval = 1*1000;
// 上海购买
// 地址信息

// [cid, quant, network, this.accounts]
// 

let pid = process.argv[2];
let cid = process.argv[3];
let quantity = process.argv[4];
let network = JSON.parse(process.argv[5]);
let accounts = JSON.parse(process.argv[6]);

function buy(cid, quant, pid, network, cookieJar, tel, pass){
    let options = {
        method: 'POST',
        url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
        headers: {
            'cache-control': 'no-cache',
            'accept-language': 'zh-CN,en-US;q=0.8',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded',
            'referer': `https://www.cmaotai.com/YsH5/page/Activity/Order.html?c=${cid}`,
            'x-requested-with': 'XMLHttpRequest',
            'cookie':cookieJar,
        },
        form: {
          action: 'ActivityManager.newOrder',
          code: cid,
          quant: quant,
          del: 14,
          inv: 0,
          inv_mail: 0,
          timestamp121: (+new Date()),
        },
        jar:true,
        json:true
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if(error){
          return resolve({
              code:0
          })
        }
        logger.info('start buy', tel, pass,cid, quant, body);
        if(body.code === 0 ){
          fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `\n${tel} ${pass} OID:${body.data.OrderId} Number:${quant} closeTime:${body.data.outoCloseTimeText} ${JSON.stringify(network)}`, {flag:'a+'});
        }
        if(body.data && body.data.StockCount <= 0){
          logger.info('已经没有库存了，结束购买流程');
          process.exit();
        }
        return resolve({
            code:0
        })
      })
    })
}
let startIndex = 0;
function buyChild() {
  let _index = startIndex;
  if(!accounts[_index]){
    logger.info('购买结束');
    process.exit();
  }
  let tel = accounts[_index].phone;
  let pass = accounts[_index].pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = accounts[_index].addressId;
  let _startTime = +new Date();
  let createOrderStartTime = +new Date();
  MaotaiService.getCurrentJar(tel)
      .then(j => {
        _startTime = +new Date();
        return buy(cid, quantity, pid, network, j, tel, pass);
      }).then( data => {
          startIndex++;
          buyChild()
      }).catch(e => {
        logger.error(e);
        startIndex++;
        buyChild()
      })
}

buyChild();
