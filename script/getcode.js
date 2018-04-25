/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const sendmsg = require('../sendmsg/');
const fs = require('fs');
const colors = require('colors/safe');
const Utils = require('../services/utils');
const request = require('request');
const path = require('path');
const proxy = require('../controllers/proxy');
let checkInterval = 1*1000;
// 上海购买
// 地址信息
let pid = '391';
let quantity = 6;
const {exec} = require('child_process');


function run() {
  proxy.switchIp().then(() => {
    return MaotaiService.netCode();
  })
  .then(data => {
    //logger.info(data)
    let imageData = data.result.data[0];
    logger.info(imageData)
    var base64 = imageData.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
    var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
    fs.writeFileSync(path.resolve(__dirname,'../images/'+data.result.tags.join('-')+".png"),dataBuffer);
    run();
  })
  .catch(e => {
    logger.error(e);
    setTimeout(() => {
        run();
    }, checkInterval);
  })
}

run()
