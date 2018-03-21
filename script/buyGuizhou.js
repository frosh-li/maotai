/**
 * 贵州地区的茅台购买
 */
const MaotaiService = require('../tools/service');
const colors = require('colors/safe');

var mysql      = require('mysql');
var request = require('request');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'accounts'
});

connection.connect();

let tels = [];


// console.log('to Buy tels', tels);
let pid = '391';
let quantity = 6;
let shopId = -1; //不限制区域




function getAccount(num){
  return new Promise((resolve, reject) => {
    connection.query('select * from accounts where status=1 and remark="汽车大厦双龙" limit 0,'+num, function(err, results){
      if(err){
        return reject(err);
      }
      return resolve(results);
    })
  })
}

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
            if (data && data.lbsdata && data.lbsdata.data && data.lbsdata.data.stock && data.lbsdata.data.stock.Sid == shopId) {
              if(
                data.lbsdata.data.stock.StockCount > 0
                &&
                data.lbsdata.data.limit.LimitCount >= quantity
              ){
                startToBy();
              }else {
                printInfo(data);
                setTimeout(() => {
                    watchQuanity(tel, pass, shopId);
                }, 60*1000);
              }

            } else {
              setTimeout(() => {
                  watchQuanity(tel, pass, shopId);
              }, 60*1000);
            }
        } else {
          console.log('data------');
          if(data && data.lbsdata && data.lbsdata.state===true && data.lbsdata.code === 0){
            printInfo(data)
            shopId = data.lbsdata.data.stock.Sid;
            if(
              data.lbsdata.data.stock.StockCount > 0
              &&
              data.lbsdata.data.limit.LimitCount >= quantity
            ){
              startToBy();
            }else {
              setTimeout(() => {
                  watchQuanity(tel, pass, shopId);
              }, 60*1000);
            }
          }else{
            setTimeout(() => {
                watchQuanity(tel, pass, shopId);
            }, 60*1000);
          }
        }
      }).catch(e => {
          console.log("位置错误,60秒后重试", e.message);
          setTimeout(() => {
              watchQuanity(tel, pass, shopId);
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
      shopid: '211110102007'
    }
  }, function(error, results){
    if(error){
      return console.log(error);
    }
    console.log(results);
  })
}

getAccount(16)
  .then(data => {
    data.forEach(cdata => {
      tels.push(JSON.stringify({
        phone:cdata.phone,
        pass: cdata.pass,
      }));
    })
    tels = tels.join("|");
    console.log(tels);
    watchQuanity(data[0].phone, data[0].pass, -1);
  })
  .catch(e => {
    console.log(e);
  })
