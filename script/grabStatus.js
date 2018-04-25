var accounts = [
  { phone: '13283936032', pass: 'a123456', addressId: 1962184 },
  { phone: '18632369087', pass: 'a123456', addressId: 1962186 },
  { phone: '13290979032', pass: 'a123456', addressId: 1962187 },
  { phone: '13936763461', pass: 'a123456', addressId: 1962189 },
  { phone: '15081820867', pass: 'a123456', addressId: 1962191 },
  { phone: '15053052761', pass: 'a123456', addressId: 1962199 },
  { phone: '18434763969', pass: 'a123456', addressId: 1962204 },
  { phone: '15035399985', pass: 'a123456', addressId: 1962205 },
  { phone: '17131970724', pass: 'a123456', addressId: 1962215 },
  { phone: '17667374197', pass: 'a123456', addressId: 1962216 },
  { phone: '15505201939', pass: 'a123456', addressId: 1962224 },
  { phone: '18831099037', pass: 'a123456', addressId: 1969317 },
  { phone: '18534866149', pass: 'a123456', addressId: 1962233 },
  { phone: '15034681449', pass: 'a123456', addressId: 1962237 },
  { phone: '15257918657', pass: 'a123456', addressId: 1962220 },
  { phone: '13413723166', pass: '123456', addressId: 1894654 },
  { phone: '13230672756', pass: 'a123456', addressId: 1951804 },
  { phone: '18183062125', pass: 'a123456', addressId: 1951807 },
  { phone: '18438063310', pass: 'a123456', addressId: 1951811 },
  { phone: '13935327172', pass: 'a123456', addressId: 1930782 }
]
if(process.argv[2]){
    accounts = require(process.argv[2]);
}
var MaotaiService = require('../tools/service');
const sendmsg = require('../sendmsg');
const path = require('path');

var currentIndex = 0;
var successAcount = [];
var failAccount = [];
var hasOrders = false;

function run(){
  let account = accounts[currentIndex];
  if(!account){
    console.log('全部结束');
    console.log(JSON.stringify(successAcount,null,4));
    console.log(JSON.stringify(failAccount,null,4));
    if(hasOrders){
      return sendmsg('15330066919', '已经有网点接单，请注意');
    }else{
      let needReorder = true;
      successAcount.forEach(item => {
        if(item.order.length > 0){
          needReorder = false;
          return;
        }
      })
      if(needReorder){
        require('child_process').fork(path.resolve(__dirname, '../script/order.js'), [process.argv[2]]);
      }
      setTimeout(() => {
        currentIndex = 0;
        successAcount = [];
        failAccount = [];
        hasOrders = false;
        run();
      },1000*60*10);
    }
    // process.exit(0);
    return;
  }
  let scopeJar = null;
  MaotaiService.getCurrentJar(account.phone)
    .then(data => {
      scopeJar = data;
      return MaotaiService.grabStatus(account, scopeJar)
    }).then(data => {
      console.log(data);
      if(data.length > 0){
          successAcount.push(
              {
                  phone: account.phone,
                  pass: account.pass,
                  addressId: account.addressId,
                  order: getOrders(data)
              }
          )
      }else{
          failAccount.push({
              phone: account.phone,
              pass: account.pass,
              addressId: account.addressId,
          })
      }
      // data.forEach(item => {
      //   if(item.sid){
      //     successAcount.push(account);
      //     return;
      //   }
      // })
      currentIndex++
      run();
    }).catch(e=>{
      currentIndex++;
      console.log(e);
      run();
    })
}

function getOrders(data){
  let ret = [];
  data.forEach(item => {
    if(item.orderStatus === 3 || item.orderStatus===4){
      ret.push(
        {
          receiptPhone: item.receiptPhone,
          sid: item.sid,
          orderId: item.orderId,
          orderStatus: item.orderStatus,
          createTime: item.createTime
        }
      )
    }
    if(item.orderStatus === 4 && item.createTime.split(" ")[0] === "2018-04-19"){
      hasOrders = true;
    }
  })
  return ret;
}

run();


/**
 * order status
 * 5: 手动取消
 * 6: 没网点接单
 * 3: 等待接单
 * 4：交易关闭
 */
