/**
 * 监控某一个站点是否已经可以抢货了
 */
const MaotaiService = require('../tools/service');
let _phones = [
  "13102661153",
  "13153185002",
  "13157440883",

]

const originPhones = [
  // {"phone":"13102661153", "pass":"123456"},
  // {"phone":"13153185002", "pass":"123456"},
  // {"phone":"13157440883", "pass":"123456"},
];

_phones.forEach(item => {
  originPhones.push({
    "phone":item,
    "pass":"123456"
  })
});


let tels = [];
originPhones.forEach(data => {
  tels.push(JSON.stringify(data));
})
tels = tels.join("|");

console.log('to Buy tels', tels);
let pid = '391';
let quantity = 6;
let shopName = '雍贵';

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
    if(data.lbsdata.data.network.SName.indexOf(item) > -1 || data.lbsdata.data.network.DName.indexOf(item) > -1){
      result = true;
    }
  })
  return result;
}

function watchQuanity(tel, pass, shopName) {
  let randomIndex = Math.floor(Math.random()*(_phones.length-1));
  tel = _phones[randomIndex]
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

        //if (shopName > 0) {
            if (data && data.lbsdata && data.lbsdata.data && data.lbsdata.data.stock && data.lbsdata.data.stock.Sid) {
              if(
                data.lbsdata.data.stock.StockCount > 0
                &&
                data.lbsdata.data.limit.LimitCount >= quantity
                &&
                fixShop(data.lbsdata.data.network, shopName)

              ){
                startToBy();
              }else {
                printInfo(data);
                setTimeout(() => {
                    watchQuanity(tel, pass, shopName);
                }, 60*1000);
              }

            } else {
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
          console.log("位置错误,60秒后重试", e.message);
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
  })
}

watchQuanity(13102661153, '123456', shopName);
// startToBy();
