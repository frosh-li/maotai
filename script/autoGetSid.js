const AliVerify = require('../tools/startAliVerify');
function getSid() {
  AliVerify.connectSidFromHard()
    .then((ok) => {
        setTimeout(getSid, 20000);
    })
    .catch(e => {
        setTimeout(getSid, 20000);
    })
}

getSid();
