const fs = require('fs');
const path = require('path');

function init(){
	let ret = [];
	let files = fs.readdirSync(path.resolve(__dirname, "./"), {});
	files.forEach(file => {
		if(file.endsWith('.json'))
		ret = ret.concat(require(path.resolve(__dirname, "./"+file)));
	})
	return ret;
}

module.exports = init()