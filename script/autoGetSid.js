const AliVerify = require('../tools/startAliVerify');
function getSid() {
  AliVerify.connectSidFromHard()
    .then((ok) => {
        setTimeout(getSid, 30000);
    })
    .catch(e => {
        setTimeout(getSid, 30000);
    })
}

getSid();
