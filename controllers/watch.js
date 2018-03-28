/**
 * 监控某一个站点是否已经可以抢货了
 */
const MaotaiService = require('../tools/service');
const fs = require('fs');
let _phones = [
]

console.log('params', process.argv);

// 是否开启购买
let needToBuy = process.argv[3];
// cookie path
let cookieAddress = process.argv[2];
if(cookieAddress){
  fs.writeFileSync("cookies/"+cookieAddress+".json", '');
}

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
  shopName = '北京路贵州饭店';
}
if(cookieAddress == "005"){
  //猫咪
  originPhones = [{"phone":"13523472132", 'pass':"abcdef7758521"},{"phone":"18037798213", 'pass':"abcdef7758521"},];
  shopName = '紫薇尚层';
}




//猫咪
// const originPhones = [{"phone":"13523472132", 'pass':"abcdef7758521"},{"phone":"18037798213", 'pass':"abcdef7758521"},];
// let shopName = '紫薇尚层';
// 13523472132/18037798213
//
// abcdef7758521
//
// // 陕西省
//
// 西安市雁塔区


// _phones.forEach(item => {
//   originPhones.push({
//     "phone":item,
//     "pass":"a123456"
//   })
// });


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

function watchQuanity(tel, pass, shopName) {
  let randomIndex = Math.floor(Math.random()*(originPhones.length-1));
  tel = originPhones[randomIndex].phone;
  pass = originPhones[randomIndex].pass;
  let userAgent = MaotaiService.userAgent(tel);
  let scopeAddress = "";
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
                //{"state":true,"code":10,"data":{"IsNeedReservation":true,"IsIntercept":false,"ProductID":391,"CanUseCredence":false,"Certificate":{"ID":"2638466","UID":2253191,"PID":"391","Status":4,"Address":{"ID":1941154,"IsDefault":false,"IsPushAddreess":true,"Name":"刘宇凡","TelPhone":"16602083513","Zipcode":"000000","ProvCode":"110000","CityCode":"110100","AreaCode":"110101","Remark":"","IsVerification":false,"AddressDetails":"北京市东城区,富贵园3区2号楼,北京东城区富贵园三区2号楼","Longitude":116.433435,"Latitude":39.894258,"Address":"富贵园3区2号楼,北京东城区富贵园三区2号楼","AddressText":"北京市东城区"},"Product":{"Pid":391,"PCode":"23","PName":"贵州茅台酒 (新飞天) 53%vol 500ml","CoverImage":"/Storage/master/product/thumbs410/410_4c7cd945371d4d95b7432d87b1b51a10.jpg"},"FailureTime":"2018-04-02 00:00:00"},"EnterTimeSlot":{"Start":"2018-03-27 00:00:00","End":"2018-03-27 23:59:59","InTime":true},"BuyTimeSlot":{"Start":"2018-03-27 10:00:00","End":"2018-03-27 16:00:00","InTime":true}}}
                console.log("商家已经上货，开始购买流程");
                if(needToBuy){
                  startToBy();
                }
                //startToBy();
              }else {
                printInfo(data);
                setTimeout(() => {
                    watchQuanity(tel, pass, shopName);
                }, 60*1000);
              }

            } else {
              console.log("商家还未上货");
              setTimeout(() => {
                  watchQuanity(tel, pass, shopName);
              }, 60*1000);
            }
        // } else {
        //   console.log('data------');
        //   if(data && data.lbsdata && data.lbsdata.state===true && data.lbsdata.code === 0){
        //     printInfo(data)
        //     shopId = data.lbsdata.data.stock.Sid;
        //     if(
        //       data.lbsdata.data.stock.StockCount > 0
        //       &&
        //       data.lbsdata.data.limit.LimitCount >= quantity
        //     ){
        //       startToBy();
        //     }else {
        //       setTimeout(() => {
        //           watchQuanity(tel, pass, shopId);
        //       }, 60*1000);
        //     }
        //   }else{
        //     setTimeout(() => {
        //         watchQuanity(tel, pass, shopId);
        //     }, 60*1000);
        //   }
        // }
      }).catch(e => {
          console.log("位置错误,60秒后重试", e);
          setTimeout(() => {
              watchQuanity(tel, pass, shopName);
          }, 60*1000);
      })
}


function startToBy() {
  request({
    url:"http://127.0.0.1:10010/api/maotai/multiOrder",
    method:"post",
    form: {
      tels: tels,
      pid: pid,
      quantity: 6,
      shopName: shopName
    }
  }, function(error, results){
    if(error){
      return console.log(error);
    }
    console.log(results);

    // 结束后再次进行观察以防遗漏
  })
}

watchQuanity(13157440883, '123456', shopName);
//startToBy();
