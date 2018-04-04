const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');

var originPhones = require("../70.json");

function start() {
  let user = originPhones.shift();
  if(!user){
    logger.info("全部登录完成");
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);
  MaotaiService.login(user.phone, user.pass, userAgent)
    .then(data => {
      logger.info(data);
      start();
    })
    .catch(e => {
      logger.error(e);
      start();
    })
}

// start();
const fs = require('fs');
const path = require('path')
function checkDone() {
  console.log("开始检查是否有未登录账号");
  let hasLogin = false;
  originPhones.forEach(item => {
    let cpath = path.resolve(__dirname,"../cookies/"+item.phone+".json");
    let out = fs.existsSync(cpath);
    if(!out){
      hasLogin = true;
      console.log(out)
    }
  })
  if(hasLogin === false){
    console.log("全部登录成功，请放心");
  }
  process.exit(0);
}

// checkDone();
start();