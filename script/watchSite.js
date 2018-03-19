/**
 * 监控某一个站点是否已经可以抢货了
 */
const MaotaiService = require('../tools/service');
const originPhones = [
  {"phone":"17097224268", "pass":"123456"},
  {"phone":"18946959184", "pass":"123456"},
  {"phone":"13413723166", "pass":"123456"},
  {"phone":"18126062487", "pass":"123456"},
  {"phone":"18666200239", "pass":"123456"},
  {"phone":"15697542180", "pass":"123456"},
  {"phone":"18520351757", "pass":"123456"},
  {"phone":"18666200239", "pass":"123456"},
  {"phone":"18620629401", "pass":"123456"},
  {"phone":"13404392769", "pass":"123456"},
  {"phone":"13293430966", "pass":"123456"},
  {"phone":"13820822341", "pass":"123456"},
  {"phone":"13286589157", "pass":"123456"},
  {"phone":"15846245347", "pass":"123456"},
  {"phone":"15131013071", "pass":"123456"},
  {"phone":"18300922367", "pass":"123456789"},
  {"phone":"15772141929", "pass":"369258"},
  {"phone":"17385157721", "pass":"123456789wang"},
  {"phone":"18207517996", "pass":"123456"},
  {"phone":"18234717199", "pass":"123456"},
  {"phone":"13642568501", "pass":"123456"},
  {"phone":"13005361278", "pass":"123456"},
  {"phone":"17324368280", "pass":"123456"},
  {"phone":"17608847451", "pass":"123456"},
  {"phone":"18935466396", "pass":"123456"},
  {"phone":"17379324087", "pass":"123456"},
  {"phone":"15602345375", "pass":"123456"},
  {"phone":"13112065961", "pass":"123456"}
];

let tels = [];
originPhones.forEach(data => {
  tels.push(JSON.stringify(data));
})
tels = tels.join("|");

console.log('to Buy tels', tels);
let pid = '391';
let quantity = 6;
let shopId = '211110105003';


function watchQuanity(tel, pass, shopId) {
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
          if (shopId > 0) {
              if (data && data.lbsdata && data.lbsdata.network && data.lbsdata.network.Sid == shopId) {
                  console.log("商家已经上货了！！！！！");
                  startToBy();
              } else {
                  console.log("商家没有上货,60秒后重试");
                  setTimeout(() => {
                      watchQuanity(tel, pass, shopId);
                  }, 60*1000);
              }
          } else {
            console.log("商家没有上货,60秒后重试");
            setTimeout(() => {
                watchQuanity(tel, pass, shopId);
            }, 60*1000);
          }
      }).catch(e => {
          console.log("位置错误,60秒后重试", e.message);
          setTimeout(() => {
              watchQuanity(tel, pass, shopId);
          }, 60*1000);
      })
}


function startToBy() {

  tels = tels.split("|");      // 电话
  pid = pid;                   // 酒品编号 飞天茅台53° 为391
  quantity = quantity || 1;    // 订购数量瓶
  let fixedShopId = shopId || -1 ; // 网点ID  211110105003 雍贵中心
  let ret = [];
  function createOne() {
    let tel = tels.shift();
    if(!tel){

      console.log({
        status: 200,
        msg:"alldone",
        datas: ret
      })
    }
    let userAgent = MaotaiService.userAgent(tel);
    MaotaiService.createOrder(JSON.parse(tel), pid , quantity,userAgent, fixedShopId)
      .then(data => {
        if(data.code === 0){
          ret.push({
            tel: tel,
            status: "SUCCESS",
            data: data
          })
          console.log('create order success', tel, pid,'error');
          setTimeout(createOne, 10);
        }else{
          console.log('create order fail', tel, pid,'error');
          ret.push({
            tel: tel,
            status: "FAIL",
            data: data
          })
          setTimeout(createOne, 10);
        }

      }).catch(e=>{
        ret.push({
          tel: tel,
          status: "FAIL",
          error:e.message
        })
        console.log('create order fail', tel, pid,'error', e.message);
        setTimeout(createOne, 10);
      })
  }
  setTimeout(createOne, 10);
}

// watchQuanity('18666200239', '123456', '211110105003');
startToBy();
