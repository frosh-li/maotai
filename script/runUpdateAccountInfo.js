const AccountService = require('../script/updateAccounts');
let fs = require('fs');
let logger = require('../controllers/logger');

//let accountsFile = require('./3.31.json');
//let accounts = require('./3.31old.json');
// accountsFile.forEach(item => {
//   accounts.push({
//     'phone': item,
//     'pass': 'a123456'
//   })
// })
let accounts = [{"phone":"17324325505","pass":"123456"},
{"phone":"17328606450","pass":"123456"},
{"phone":"18024127634","pass":"123456"},
{"phone":"17727114231","pass":"123456"},
{"phone":"15302997813","pass":"123456"},
{"phone":"18038694099","pass":"123456"},
{"phone":"17324344544","pass":"123456"},
{"phone":"15302997784","pass":"123456"},
{"phone":"15302996281","pass":"123456"},
{"phone":"17322248121","pass":"123456"},
{"phone":"15302997532","pass":"123456"},
{"phone":"15302984575","pass":"123456"},
{"phone":"17324345325","pass":"123456"},
{"phone":"17324343773","pass":"111222"},
{"phone":"17306654917","pass":"123456"},
{"phone":"17324004742","pass":"123456"},
{"phone":"17324328959","pass":"123456"},
{"phone":"17324297950","pass":"123456"},
{"phone":"13262949328","pass":"456789"},
{"phone":"13711456713","pass":"qwe12345678"},
{"phone":"17324297953","pass":"123456"},
{"phone":"18127854003","pass":"123456"},
{"phone":"18127856294","pass":"123456"},
{"phone":"17324329235","pass":"123456"}];
let totals = accounts.length;
let success = [];
let fail = [];

function startUpdate() {
  logger.info('总共:'+totals+'完成:'+success.length+ '失败:'+ fail.length);
  let account = accounts.shift();
  if(!account){
    logger.info('update all done');
    logger.info('fail');
    fs.writeFileSync('./4.3.fail.json', JSON.stringify(fail));
    logger.info(fail);
    logger.info('success')
    logger.info(success);
    fs.writeFileSync('./4.3.success.json', JSON.stringify(success));
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