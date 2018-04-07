const AliVerify = require('../tools/startAliVerify');
let timeoutInterval = 10; // 秒为单位
function getSid(aliVerify) {
  aliVerify.connectSidFromHard()
    .then((ok) => {
    		console.log(ok);
        // setTimeout(() => {getSid(aliVerify)}, timeoutInterval * 1000);
    })
    .catch(e => {
    	console.log(e.message);
      // setTimeout(() => {getSid(aliVerify)}, timeoutInterval * 1000);
    })
}
// setInterval(getSid, 60000);

const {execSync} = require('child_process');

let allDevices = execSync('adb devices').toString();
console.log(allDevices);

let match = allDevices.match(/^([0-9a-zA-Z\-]+)\s+device$/gm);
if(!match || match.length <= 0){
	console.log("找不到设备");
	return;
}
let devices = [];

match.forEach(item => {
	devices.push(item.split("\t")[0]);
})

console.log(devices);
let intervals = {

}
devices.forEach(item => {
	((item) => {
		let aliVerify = new AliVerify(item);
		getSid(aliVerify);
		intervals[item] = setInterval(() => {
			let aliVerify = new AliVerify(item);
			getSid(aliVerify);
		}, timeoutInterval * 1000);
	})(item)

})


