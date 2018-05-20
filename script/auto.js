function generate(start, n) {
	for(let i = 0 ; i < n ; i++){
		let a = Math.floor(Math.random()*start)+50;
		let b = Math.floor(Math.random()*(a-10))+10;
		console.log(`${a}-${b}=`);
	}
}


generate(50,15);