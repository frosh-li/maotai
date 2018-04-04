const AccountService = require('../script/updateAccounts');
let fs = require('fs');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'accounts'
});

connection.connect();

let logger = require('../controllers/logger');
let accounts = [];
let totals = accounts.length;
let success = [];
let fail = [];

function startUpdate() {
  logger.info('总共:'+totals+'完成:'+success.length+ '失败:'+ fail.length);
  let account = accounts.shift();
  if(!account){
    logger.info('update all done');
    logger.info('fail');
    logger.info(fail);
    logger.info('success')
    logger.info(success);
    return;
  }
  AccountService.updateAccount(account)
  .then(data => {
    let cdata = {
      phone: data.phone || "",
      pass: data.pass || "",
      address: data.address || "",
      name: data.name || "",
      province: data.ProvinceId || "",
      addressId: data.addressId,
      city: data.CityId || "",
      area: data.DistrictsId || "",
      lng: data.lng || "",
      lat: data.lat || "",
      orderTime: data.OrderDate || "",
      order_status: data.OrderStatus || "",
      PayStatus: data.PayStatus || "",
      ShopId:data.ShopId || "",
      apointStatus: data.apointStatus || "",
      buyStartTime: data.buyStartTime || "",
      buyEndTime: data.buyEndTime || "",
      apointRemark:data.reviewInfo || "",
      remark: data.remark || ""
    };
    success.push(cdata);
    updateAccountSync(cdata);
    startUpdate();
  }).catch(e => {
    fail.push({
      phone: account.phone,
      pass: account.pass,
      remark: e.message
    });
    startUpdate();
  })
}
getAccounts()
  .then(accounts => {
    startUpdate();  
  }).catch(e => {
    console.log(e);
  })

function getAccounts() {
  return new Promise((resolve, reject) => {
    connection.query('select phone,pass from accounts', (err, results) => {
      if(err){
        console.log(err);
        return reject(false);
      }
      accounts = results;
      totals = results.length;
      return resolve(true);
    })
  })
}

connection.config.queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      return this.escape(values[key]);
    }
    return txt;
  }.bind(this));
};

function updateAccountSync(data){
  let sql = `
    update accounts set 
    province=:province,
    city=:city,
    area=:area,
    address=:address,
    apointStartTime=:buyStartTime,
    apointEndTime=:buyEndTime,
    buyStartTime=:buyStartTime,
    buyEndTime=:buyEndTime,
    order_status=:order_status,
    PayStatus=:PayStatus,
    addressId=:addressId,
    lat=:lat,
    lng=:lng,
    orderTime=:orderTime,
    apointStatus=:apointStatus,
    apointRemark=:apointRemark,
    name=:name,
    ShopId=:ShopId
    where phone='${data.phone}'
  `;
  console.log(sql);
  console.log(data)
  connection.query(sql, data, (err, results) => {
    if(err){
      console.log(err);
    }else{
      console.log("update account", data.phone);
    }
  })
}