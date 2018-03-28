const AliVerify = require('../tools/startAliVerify');
function getSid() {
  AliVerify.connectSidFromHard()
    .then((ok) => {
        getSid();
    })
    .catch(e => {
        getSid();
    })
}

getSid();
