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

function get100(data){
  let ret = [];
  data.forEach(item => {
    if(item.addressId > 0){
      ret.push(item);
    }
  })

  //if(ret.length === 80){
    fs.writeFileSync("./accounts/hefei.json", JSON.stringify(ret, null, 4));
  //}
}


var allAccounts = require("./accounts/bejing4.11.json");


get100(allAccounts);