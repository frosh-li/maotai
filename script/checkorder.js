var request = require('request');
var accounts = require('../accounts/132320500001.json');
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
		if(body && body.data){
			if(body.data.Productid == 628){
				console.log(account.phone, account.pass);
				//console.log(body.data);
			}

		}
		getOrder();
	})
}

getOrder();