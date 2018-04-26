let code = 440000;
var networks = require(`./networks/${code}.json`);

var ret = [];

networks.forEach(network => {
    ret.push({
        id:network.Sid,
        name:network.OutletsName,
        address:network.OutletsAddress,
        tel:network.OutletsLinkTel,
        dname:network.DealerName
    })
})
const fs = require('fs');
const path = require('path');
fs.writeFileSync(path.resolve(__dirname, `./networks/${code}.json`), JSON.stringify(ret, null, 4));
console.log(JSON.stringify(ret, null, 4))
