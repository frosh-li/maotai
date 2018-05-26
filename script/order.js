//const accounts = require("../accounts/bj_000.json");
// const accounts = [
//   {phone:"18903188059", pass:"a123456", addressId:1930701}
// ]
var accounts = [
    {
        "phone": "15951853170",
        "pass": "123456",
        "addressId": 1885124
    },
    {
        "phone": "18537303412",
        "pass": "z410781"
    },
    {
        "phone": "13720689056",
        "pass": "a123456",
        "addressId": 1951717
    },
    {
        "phone": "18864854877",
        "pass": "a123456",
        "addressId": 1951722
    },
    {
        "phone": "13463414918",
        "pass": "a123456",
        "addressId": 1951723
    },
    {
        "phone": "18764735850",
        "pass": "a123456",
        "addressId": 1951724
    },
    {
        "phone": "15835086989",
        "pass": "a123456",
        "addressId": 1951725
    },
    {
        "phone": "15247493282",
        "pass": "a123456",
        "addressId": 1951726
    },
    {
        "phone": "15665166293",
        "pass": "a123456",
        "addressId": 1951731
    },
    {
        "phone": "15830750275",
        "pass": "a123456",
        "addressId": 1951732
    },
    {
        "phone": "17879529656",
        "pass": "a123456",
        "addressId": 1951733
    },
    {
        "phone": "18743635726",
        "pass": "a123456",
        "addressId": 1951735
    },
    {
        "phone": "13513642792",
        "pass": "a123456",
        "addressId": 1951737
    },
    {
        "phone": "18698817813",
        "pass": "a123456",
        "addressId": 1951753
    },
    {
        "phone": "18533703270",
        "pass": "a123456",
        "addressId": 1951805
    },
    {
        "phone": "18183062125",
        "pass": "a123456",
        "addressId": 1951807
    },
    {
        "phone": "18438063310",
        "pass": "a123456",
        "addressId": 1951811
    },
    {
        "phone": "15082907866",
        "pass": "a123456",
        "addressId": 1951812
    },
    {
        "phone": "17631880252",
        "pass": "a123456",
        "addressId": 1951813
    },
    {
        "phone": "13333176802",
        "pass": "a123456",
        "addressId": 1930785
    },
    {
        "phone": "13624666057",
        "pass": "a123456",
        "addressId": 1930787
    },
    {
        "phone": "15935492346",
        "pass": "a123456",
        "addressId": 1930788
    }
]
if(process.argv[2]){
    accounts = require(process.argv[2]);
}

let orderCount = 6;

if(process.argv[3]){
    orderCount = process.argv[3];
}

var grabController = require('../controllers/grabController');

console.log(accounts);


let bindAccountsTotal =20;
var currentIndex = 5;
function bindNetwork(){
  let account = accounts.shift();
  if(!account){
    console.log('绑定结束');
    process.exit(0);
    return;
  }

  let a =new grabController(account,orderCount, function(err, data){
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
