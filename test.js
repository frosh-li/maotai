var md5 = require('md5');
var date = +new Date("2018-04-26 15:37:12");
console.log(date);
// eb47709ac0c442dcb2fecb088ae002aa
for(let i = date ; i < (date+60000) ; i++){
	if(md5(i) =="eb47709ac0c442dcb2fecb088ae002aa"){
		console.log('find',i);
		break;
	}else{
		console.log(md5(i));
	}
}
console.log(md5(date));
