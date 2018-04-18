//const accounts = require('../accounts/bj_000.json');
//const accounts = require('../accounts/shanghai231310115001.json')
const accounts = [
    {
        "phone": "13624666057",
        "pass": "a123456",
        "addressId": 1930787
    },
    {
        "phone": "15935492346",
        "pass": "a123456",
        "addressId": 1930788
    },
    {
        "phone": "15082907866",
        "pass": "a123456",
        "addressId": 1951812
    },
    {
        "phone": "18533703270",
        "pass": "a123456",
        "addressId": 1951805
    },
    {
        "phone": "13513642792",
        "pass": "a123456",
        "addressId": 1951737
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
        "phone": "13720689056",
        "pass": "a123456",
        "addressId": 1951717
    },
    {
        "phone": "15238555689",
        "pass": "a123456",
        "addressId": 1951714
    },
    {
        "phone": "15549208672",
        "pass": "123456",
        "addressId": 1905922
    },
    {
        "phone": "18834168128",
        "pass": "A3396815",
        "addressId": 1898547
    },
    {
        "phone": "18537303412",
        "pass": "z410781",
        "addressId": 1726502
    },
    {
        "phone": "15075870950",
        "pass": "123456",
        "addressId": 1712578
    },
    {
        "phone": "13593493641",
        "pass": "a123456",
        "addressId": 1930789
    }
];
var bindNetworkController = require('../controllers/BindNetwork');

console.log(accounts);
const shopIds = {
  "231310115001": [],
  "211110105016": []
}

let bindAccountsTotal =50;
var currentIndex = 0;
function bindNetwork(){
  let account = accounts.shift();
  if(!account || currentIndex >= 50 ){
    console.log('绑定结束');
    process.exit(0);
    return;
  }


  let a =new bindNetworkController(account, '231310115001', function(err){
      if(err){
        console.log(err.message);
      }
      currentIndex++;
      bindNetwork();
  });


}

bindNetwork();
