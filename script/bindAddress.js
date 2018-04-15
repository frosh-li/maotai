const accounts = require('../accounts/4.13.json');

var bindNetworkController = require('../controllers/BindNetwork');

console.log(accounts);
const shopIds = {
  "111110105015": [],
  "211110105016": []
}

let bindAccountsTotal =20;
var currentIndex = 0;
function bindNetwork(){
  let account = accounts.shift();
  if(!account || currentIndex >= 40 ){
    console.log('绑定结束');
    process.exit(0);
    return;
  }


  let a =new bindNetworkController(account, currentIndex < 20 ? '111110105015':'211110105016', function(err){
      if(err){
        console.log(err.message);
      }
      currentIndex++;
      bindNetwork();
  });


}

bindNetwork();
