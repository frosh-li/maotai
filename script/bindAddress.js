//const accounts = require('../accounts/bj_000.json');
//const accounts = require('../accounts/shanghai231310115001.json')
var accounts = [
    {
        "phone": "15330066919",
        "pass": "110520",
        "addressId": 1906787
    }]
var shopID = '';
if(process.argv[2]){
    accounts = require(process.argv[2]);
}
if(process.argv[3]){
  shopID = process.argv[3]
}
var bindNetworkController = require('../controllers/BindNetwork');

console.log(accounts);

let bindAccountsTotal =50;
var currentIndex = 0;
function bindNetwork(){
  let account = accounts.shift();
  if(!account){
    console.log('绑定结束');
    process.exit(0);
    return;
  }


  let a =new bindNetworkController(account, shopID, function(err){
      if(err){
        console.log(err.message);
      }
      currentIndex++;
      bindNetwork();
  });


}

bindNetwork();
