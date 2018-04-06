const AliVerify = require('../tools/startAliVerify');
function getSid() {
  AliVerify.connectSidFromHard()
    .then((ok) => {
    		console.log(ok);
//        setTimeout(getSid, 10000);
    })
    .catch(e => {
    	console.log(e);
 //       setTimeout(getSid, 10000);
    })
}
//setInterval(getSid, 10000);
getSid();

