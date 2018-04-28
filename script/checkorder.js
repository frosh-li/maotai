var request = require('request');
var accounts = require('../accounts/4.13.json').concat(require('../accounts/gansu.json'));
let ret = [];
function getOrder() {
	let account = accounts.shift();
	if(!account){
		console.log('done');
		console.log(ret.join('\n'));
		return;
	}
	let options = {
      method: 'POST',
      url:"http://47.94.238.179/api/maotai/getOrder",
      form: {
      	tel:account.phone,
      	pass: account.pass,
      },
      json:true
  };
	request(options, function(err, _, body){
		if(err){
			console.log(err);
			return getOrder();
		}
		if(body && body.data && body.data.length > 0){
			body.data.forEach(data => {
				let closeTime = +new Date(data.autoCloseDate);
				console.log(data);
				let now = +new Date();
				if(
					(data.PayStatus === 1 && data.zt === null)  //如果是已经支付过，没有提货的需要注意
					||
					(data.PayStatus === 0 && now <= closeTime) // 没有支付并且没有过自动关闭时间
				){
					ret.push(`${account.phone} ${account.pass} ${data.OrderId} ${data.ShopId} 下单时间:${data.OrderDate} 支付期限:${data.autoCloseDate} 数量:${data.Quantity} 支付:${data.PayStatus}`);	
				}
			})
		}
		getOrder();
	})
}

getOrder();