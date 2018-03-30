const AccountService = require('../script/updateAccounts');
let fs = require('fs');
let logger = require('../controllers/logger');

let accountsFile = require('./3.31.json');
let accounts = require('./3.31old.json');
accountsFile.forEach(item => {
  accounts.push({
    'phone': item,
    'pass': 'a123456'
  })
})

let totals = accounts.length;
let success = [];
let fail = [];

function startUpdate() {
  logger.info('总共:'+totals+'完成:'+success.length+ '失败:'+ fail.length);
  let account = accounts.shift();
  if(!account){
    logger.info('update all done');
    logger.info('fail');
    fs.writeFileSync('./3.31.fail.json', JSON.stringify(fail));
    logger.info(fail);
    logger.info('success')
    logger.info(success);
    fs.writeFileSync('./3.31.success.json', JSON.stringify(success));
    return;
  }
  AccountService.updateAccount(account)
  .then(data => {
    success.push({
      phone: data.phone || "",
      pass: data.pass || "",
      address: data.address || "",
      name: data.name || "",
      ProvinceId: data.ProvinceId || "",
      CityId: data.CityId || "",
      DistrictsId: data.DistrictsId || "",
      lng: data.lng || "",
      lat: data.lat || "",
      OrderDate: data.OrderDate || "",
      OrderStatus: data.OrderStatus || "",
      PayStatus: data.PayStatus || "",
      ShopId:data.ShopId || "",
      apointStatus: data.apointStatus || "",
      buyStartTime: data.buyStartTime || "",
      buyEndTime: data.buyEndTime || "",
      reviewInfo:data.reviewInfo || "",
      remark: data.remark || ""
    });
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

startUpdate();