const AliVerify = require('../tools/startAliVerify');
function getSid() {
  AliVerify.connectSidFromHard()
    .then((ok) => {
    		console.log(ok);
        //setTimeout(getSid, 60000);
    })
    .catch(e => {
    		console.log(e);
        //setTimeout(getSid, 60000);
    })
}
setInterval(getSid, 60000);
//getSid();
