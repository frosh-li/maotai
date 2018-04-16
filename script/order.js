//const accounts = require("../accounts/bj_000.json");
// const accounts = [
//   {phone:"18903188059", pass:"a123456", addressId:1930701}
// ]
const accounts = [
  { phone: '13283936032', pass: 'a123456', addressId: 1962184 },
  { phone: '18632369087', pass: 'a123456', addressId: 1962186 },
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
var grabController = require('../controllers/GrabController');

console.log(accounts);


let bindAccountsTotal =20;
var currentIndex = 0;
function bindNetwork(){
  let account = accounts.shift();
  if(!account || currentIndex >= 5 ){
    console.log('绑定结束');
    process.exit(0);
    return;
  }

  let a =new grabController(account, function(err, data){
      if(err){
        console.log(err.message);
      }
      if(data){
        console.log(`定向下单完成${account.phone}:${account.pass}:${data}`);
      }
      currentIndex++;
      bindNetwork();
  });
}

bindNetwork();
