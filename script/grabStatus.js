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

var currentIndex = 0;
var successAcount = [];
var failAccount = [];
function run(){
  let account = accounts.shift();
  if(!account){
    console.log('全部结束');
    console.log(JSON.stringify(successAcount,null,4));
    console.log(JSON.stringify(failAccount,null,4));
    process.exit(0);
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
                  order: {
                      receiptPhone: data[0].receiptPhone,
                      sid: data[0].sid,
                      orderId: data[0].orderId
                  }
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
      run();
    }).catch(e=>{
      console.log(e);
      run();
    })
}

run();
