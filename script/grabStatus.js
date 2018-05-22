var accounts = [
]
if(process.argv[2]){
    accounts = require(process.argv[2]);
}
var MaotaiService = require('../tools/service');
const sendmsg = require('../sendmsg');
const Utils = require('../services/utils');
const path = require('path');
const fs = require('fs');

var currentIndex = 0;
var successAcount = [];
var failAccount = [];
var hasOrders = false;
var sendmap = {};

function run(){
  let account = accounts[currentIndex];
  console.log("当前处理账号序列", currentIndex);
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
      //if(needReorder){
        require('child_process').fork(path.resolve(__dirname, '../script/order.js'), [process.argv[2]]);
      //}
      setTimeout(() => {
        currentIndex = 0;
        successAcount = [];
        failAccount = [];
        hasOrders = false;
        run();
      },1000*60*30);
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
                  order: getOrders(data, account)
              }
          )
      }else{
          failAccount.push({
              phone: account.phone,
              pass: account.pass,
              addressId: account.addressId,
          })
          // require('child_process').fork(path.resolve(__dirname, '../script/order.js'), [, JSON.stringify(account)]);
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

function getOrders(data, account){
  let ret = [];
  data.forEach(item => {
    if(item.orderStatus <= 4 && item.createTime.replace(/\-/g,'').indexOf(Utils.dateFormat()) > -1){
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
    if(item.orderStatus === 4 && item.orderId.indexOf(Utils.dateFormat()) > -1){
      if(!sendmap[account.phone]){
        sendmsg('15330066919', `${account.phone}:${account.pass}`);
        sendmap[account.phone] = item.orderId;
        fs.writeFileSync(path.resolve(__dirname,'../output/'+Utils.dateFormat()+".json"), `${account.phone}:${account.pass}`,  {flag:'a+'});  
      }
    }
  })
  console.log(JSON.stringify(ret, null, 4));
  // if(ret.length === 0){
  //   require('child_process').fork(path.resolve(__dirname, '../script/order.js'), ['', [JSON.stringify(account)]]);
  // }
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
