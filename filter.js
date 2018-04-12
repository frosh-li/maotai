const fs = require('fs');
function filter(container, filter){
	let ret = [];
	container.forEach(item => {
		let canpush = true;
		filter.forEach(_item => {
			if(_item.phone === item.phone) {
				canpush = false;
				return;
			}
		})
		if(canpush){
			ret.push(item);
		}
	})
	fs.writeFileSync("./accounts/bejing4.11.json", JSON.stringify(ret, null, 4));
  return ret;
}



var allAccounts = require("./all200.json");

let out = filter(allAccounts, require("./accounts/beijing.json"));
