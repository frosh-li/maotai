/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const fs = require('fs');
const colors = require('colors/safe');
const request = require('request');
const Utils = require('../services/utils');
const sendmsg = require('../sendmsg');

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
          return resolve([]);
        }
        logger.info('start buy', tel, pass,cid, quant, body);
        if(body.code === 0 ){
          sendmsg('15330066919', `${tel} ${pass} 数量:${quant}`);
          fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `\n${tel} ${pass} 商品:${pid} 数量:${quant} ${JSON.stringify(network)} ${JSON.stringify(body)} ${cid}`, {flag:'a+'});
        }else if(body.code === 2){
          return resolve({
            code:0
          })
        }else{
          console.log('购买结束');
          process.exit();
        }
        return resolve(body);
      })
    })
}

function buyChild() {
  let _index = Math.floor(Math.random()*accounts.length);
  let tel = accounts[_index].phone;
  let pass = accounts[_index].pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = accounts[_index].addressId;
  let _startTime = +new Date();
  let createOrderStartTime = +new Date();
  let currentJar = null;
  MaotaiService.getCurrentJar(tel)
      .then(j => {
        currentJar = j;
        _startTime = +new Date();
        return buy(cid, quantity, pid, network, j, tel, pass);
        //return MaotaiService.createOrderByScan(tel, pid , 6, userAgent, scopeAddress, fixedShopId, currentJar);
      }).then( data => {
          if(data.code === 0){
            buyChild()
          }else{
            process.exit();
          }
      }).catch(e => {
        logger.error(e);
        buyChild()
      })
}

buyChild();
