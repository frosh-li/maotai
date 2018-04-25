const fs = require('fs')
let filename = './output/'+process.argv[2]+".json";
let data= fs.readFileSync(filename).toString('utf-8');
let cdata = data.match(/数量:(\d+)/gm);
let totals = 0;
cdata.forEach(item => {
	totals += parseInt(item.split(":")[1]);
})
console.log(totals);
