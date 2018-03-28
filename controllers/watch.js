/**
 * 监控某一个站点是否已经可以抢货了
 */
const MaotaiService = require('../tools/service');
const fs = require('fs');
const colors = require('colors/safe');
const request = require('request');
const proxy = require('./proxy');

let _phones = [
]

console.log('params', process.argv);

// 是否开启购买
let needToBuy = process.argv[3];
// cookie path
let cookieAddress = process.argv[2];
if(cookieAddress){
  fs.writeFileSync("cookies/"+cookieAddress+".json", '');
  MaotaiService.initCookiePath(cookieAddress);
}
let checkInterval = 1*1000;
// 上海购买
// 地址信息
let pid = '391';
let quantity = 6;

var originPhones = require("../accounts.json");
let shopName = '集玉进出口';
if(cookieAddress == "001"){
  quantity = 12;
}
if(cookieAddress == "002"){
  // 猪小弟 两单
  originPhones = require("../accounts/zhuxiaodi.json");
  shopName = '七里河区';
  // const originPhones = require("../accounts/zhuxiaodi2.json");
  // let shopName = '甘南路';
}

if(cookieAddress == "003"){
  // 猪小弟 两单
  originPhones = require("../accounts/zhuxiaodi2.json");
  shopName = '甘南路';
  // const originPhones = require("../accounts/zhuxiaodi2.json");
  // let shopName = '甘南路';
}

if(cookieAddress == "004"){
  // 张先生10单
  originPhones = require("../accounts/zhang.json");
  shopName = '贵州饭店';
}
if(cookieAddress == "005"){
  //猫咪
  originPhones = [{"phone":"13523472132", 'pass':"abcdef7758521"},{"phone":"18037798213", 'pass':"abcdef7758521"},];
  shopName = '紫薇尚层';
}

let tels = [];
originPhones.forEach(data => {
  tels.push(JSON.stringify(data));
})
tels = tels.join("|");

console.log('to Buy tels', tels);

function printInfo(data){
  try{
    console.log('推送网点信息');
    console.log("NAME:", data.lbsdata.data.network.Address)
    console.log("SID:", data.lbsdata.data.stock.Sid);
    console.log("total:",data.lbsdata.data.stock.StockCount)
    console.log("limit:", data.lbsdata.data.limit.LimitCount)
  }catch(e){
    console.log(e);
  }
}


function fixShop(network, shopName) {
  let result = false;
  let allShopNames = shopName.split("|");
  console.log(allShopNames);
  allShopNames.forEach(item=>{
    if(
        network.SName.indexOf(item) > -1
        ||
        network.DName.indexOf(item) > -1
        ||
        network.Address.indexOf(item) > -1
        ){
      result = true;
    }
  })
  return result;
}

function watchQuanity(shopName) {
  let randomIndex = Math.floor(Math.random()*(originPhones.length-1));
  let tel = originPhones[randomIndex].phone;
  let pass = originPhones[randomIndex].pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = "";
  proxy.switchIp().then(() => {
    MaotaiService.login(tel, pass, userAgent)
        .then(data => {
            return MaotaiService.getAddressId(tel)
        })
        .then(address => {
            scopeAddress = address;
            return MaotaiService.LBSServer(address, tel, userAgent);
        })
        .then(data => {
          console.log(JSON.stringify(data.lbsdata));
          //if (shopName > 0) {
              if (data && data.lbsdata && data.lbsdata.data && data.lbsdata.data.stock && data.lbsdata.data.stock.Sid) {
                if(
                  data.lbsdata.data.stock.StockCount > 0
                  &&
                  data.lbsdata.data.limit.LimitCount >= quantity
                  &&
                  fixShop(data.lbsdata.data.network, shopName)

                ){
                  console.log(colors.green("商家已经上货，开始购买流程"));
                  printInfo(data);
                  if(needToBuy){
                    startToBy();
                  }
                }else {
                  printInfo(data);
                  setTimeout(() => {
                      watchQuanity(shopName);
                  }, checkInterval);
                }

              } else {
                console.log(colors.red("商家还未上货"));
                setTimeout(() => {
                    watchQuanity(shopName);
                }, checkInterval);
              }
        }).catch(e => {
            console.log("位置错误,60秒后重试", e);
            setTimeout(() => {
                watchQuanity(shopName);
            }, checkInterval);
        })
  })
  .catch(e => {
    console.log(e);
  })
}


function startToBy() {
  request({
    url:"http://127.0.0.1:10010/api/maotai/multiOrder",
    method:"post",
    form: {
      tels: tels,
      pid: pid,
      quantity: quantity,
      shopName: shopName
    }
  }, function(error, results, body){
    if(error){
      return console.log(error);
    }
    console.log(body);
  })
}

watchQuanity(shopName);
// startToBy();
