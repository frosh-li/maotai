/**
 * 监控活动页面
 * 每次请求5个
 */
const request = require('request');
const fs = require('fs');
const path = require('path');
const Utils = require('../services/utils');
const sendmsg = require('../sendmsg');
const queueCount = 10;
var networks = require('../networks/120000.json');	// 天津
networks = [];
// networks = networks.concat(require('../networks/320000.json')); // 江苏
// // networks = networks.concat(require('../networks/130000.json')); // 河北
// // networks = networks.concat(require('../networks/410000.json')); // 河南
// // networks = networks.concat(require('../networks/370000.json'));
// networks = networks.concat(require('../networks/620000.json')); // 兰州
// networks = networks.concat(require('../networks/110000.json')); // 兰州
// networks = networks.concat(require('../networks/120000.json')); // 兰州
// // networks = networks.concat(require('../networks/610100.json'));
// // networks = networks.concat(require('../networks/510000.json'));
// // networks = networks.concat(require('../networks/350000.json'));
// // networks = networks.concat(require('../networks/340000.json'));
networks = require('../networks/');
// //networks = networks.concat(require('../networks/510000.json'));
// let chengdu = require('../networks/510000.json');
// chengdu.forEach(item => {
// 	if(item.address.indexOf("成都") > -1){
// 		networks.push(item);
// 	}
// })
var accounts = [
    {phone:"15330066919", pass:"110520"}
]


if(process.argv[2]){
	accounts = require(process.argv[2]);
}
let startTime = 0;
const Filecookietore = require('tough-cookie-filestore');
// const accounts = require('../accounts/accounts');
console.log('网点个数',networks.length);
class ScanActivity {
	constructor(maxProcess) {
		this.maxProcess = queueCount || 30;
		this.startIndex = 0;
		this.promises = [];
		this.queues = [];
		this.acts = [];
		this.cookieJar = null;
		this.account = accounts[Math.floor(Math.random()*accounts.length)];
		// this.getCurrentJar(this.account.phone);
	}

	getCurrentJar(tel) {
		return new Promise((resolve, reject) => {
			let path = './cookies/'+tel+'.json';
      var v = new Filecookietore(path);
      v.findCookies('www.cmaotai.com','/', (err, cookie)=>{
        if(err){
          console.log('cookie error');
          return reject(err);
        }
        this.cookieJar = cookie.join(";");
        return resolve(this.cookieJar);
      })
		})

  }

	start() {

		// if(this.startIndex >= networks.length - 1){
		// 	console.log('所有扫描结束,1分钟后继续开启扫描');
		// 	console.log(this.acts);
		// 	this.account = accounts[Math.floor(Math.random()*accounts.length)];
		// 	this.getCurrentJar(this.account.phone);
		// 	this.startIndex = 0;
		// 	this.acts = [];
		// 	setTimeout(() => {
		// 		this.start();
		// 	}, 1000)
		// 	//start();
		// 	return;
		// }
		this.promises = [];
		this.queues = [];
		this.startIndex = 0 ;
		this.account = accounts[Math.floor(Math.random()*accounts.length)];
		this.acts = [];
		let that = this;
		for(let i = 0 ; i < networks.length ; i++,this.startIndex++){
			if(i < queueCount){
				this.promises.push(this.scanSingle(networks[this.startIndex]));
			}else{
				((networks, i)=>{
					this.promises.push(new Promise((resolve, reject) => {
						const task = () => {
							that.scanSingle(networks[i])
							.then((data) => {
								return resolve(data)
							}).catch(e => {
								return reject(e);
							})
						}
						that.queues.push(task);
					}));
					
				
				})(networks, i)
				
			}
		}
		startTime = +new Date();
		Promise.all(this.promises)
			.then(datas => {
				datas.forEach(data => {
					if(data.length > 0){
						this.acts = this.acts.concat(data);
					}
				})
				console.log('所有扫描结束,耗时:',(+new Date()) - startTime+"MS");
				setTimeout(() => {
					this.start();
				}, 5000)
			})
			.catch(e => {
				console.log(e.message);
			})
	}

	options(sid) {
		let options = {
        method: 'POST',
        url: 'https://www.cmaotai.com/API/Servers.ashx',
        form: {
            action: 'ActivityManager.Activitys',
						sid: sid,
						pid: 0
        },
        json:true,
        jar:true,
        timeout:10000,
    };
    return options;
	}

	checkEnd(){
		if(this.queues.length > 0){
			console.log('剩余检测数量',this.queues.length);
			this.queues.shift()();
		}else{
			console.log('OOOOOO所有扫描结束,耗时:',(+new Date()) - startTime+"MS");
			// setTimeout(() => {
				// 	this.start();
				// }, 5000)
		}
	}

	scanSingle(network) {
		
		let that = this;
		// return new Promise((_resolve, _reject) => {
			return new Promise((resolve, reject) => {
					console.log('网点开始检查', network.id, network.address);
					request(that.options(network.id), (error, response, body) => {
						if(error){
							console.log(network.id, network.address,error.message);
							that.checkEnd();
							return resolve([]);
						}

						if(body.code === 0 && body.data.acts !== undefined && body.data.acts.length > 0){
							let ret = [];
							let buyPromises=[];
							console.log('网点检查结束,',network.id, network.address,JSON.stringify(body.data.acts));
							body.data.acts.forEach(act => {
								if(act.Pid === 628){
									fs.writeFileSync(`output/${Utils.dateFormat()}-628.json`, `\n${JSON.stringify(act)}`, {flag:'a+'});
								}
								if((act.Pid === 391)
										||
										(act.Pid === 628)
										||
										(act.Pid === 641)){
									ret.push(act);
								}
								if(act.LimitCount > 0){
									if(
										(act.Pid === 391)
										||
										(act.Pid === 628)
										// ||
										// (act.Pid === 422)
										||
										(act.Pid === 641)
										){
										console.log('可以购买', JSON.stringify(act));
										// if(act.Pid === 391){
										// 	if(act.LimitCount >= 5){
										// 		this.buy(act.ID, act.LimitCount,act.Pid, network)
										// 	}
										// }else{
										buyPromises.push(that.buy(act.ID, act.LimitCount,act.Pid, network));
										// }
									}
								}
							})
							if(buyPromises.length > 0){
								Promise.all(buyPromises)
									.then(() => {
											that.checkEnd();
											return resolve(ret);		
									})
									.catch(e => {
										that.checkEnd();
										return resolve([]);		
									})
							}else{
								that.checkEnd();
								return resolve([]);	
							}
						}else{
							that.checkEnd();
							return resolve([]);
						}
					})
				})
		// });
	}

	buy(cid, quant, pid, network){
		return new Promise((resolve, reject) => {
			//if(quant < 5 && pid==391){
			//	console.log('数量过少不下单');
			//	return resolve([]);
			//}
			this.getCurrentJar(this.account.phone)
				.then(cookieJar => {
					let options = {
			        method: 'POST',
			        url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
			        headers: {
			            'cache-control': 'no-cache',
			            'accept-language': 'zh-CN,en-US;q=0.8',
			            'accept': 'application/json, text/javascript, */*; q=0.01',
			            'content-type': 'application/x-www-form-urlencoded',
			            'referer': `https://www.cmaotai.com/YsH5/page/Activity/Order.html?c=${cid}`,
			            'x-requested-with': 'XMLHttpRequest',
			            'cookie':cookieJar,
			        },
			        form: {
			        	action: 'ActivityManager.newOrder',
								code: cid,
								quant: quant,
								del: 14,
								inv: 0,
								inv_mail: 0,
								timestamp121: (+new Date()),
			        },
			        jar:true,
			        json:true,
			        timeout:10000,
			    };


					request(options, (error, response, body) => {
						if(error){
							console.log('下单异常', error.message);
							return resolve([]);
						}
						console.log('开始下单', pid,this.account.phone,this.account.pass, quant, JSON.stringify(body), JSON.stringify(network));
						if(body.code === 0 ){
							fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `\n${this.account.phone} ${this.account.pass} 商品:${pid} 数量:${quant} ${JSON.stringify(network)} ${JSON.stringify(body)} ${cid}`, {flag:'a+'});
							if(pid === 628){
								sendmsg('15330066919', `${this.account.phone}:${this.account.pass}:${JSON.stringify(body)}`);
							}
							require('child_process').fork(path.resolve(__dirname,'./buyFixedAct.js'), [pid,cid, quant, JSON.stringify(network), JSON.stringify(accounts)]);
						}else if(body.code === 3 && body.data.StockCount > 0){
							quant = body.data.StockCount;
							require('child_process').fork(path.resolve(__dirname,'./buyFixedAct.js'), [pid,cid, quant, JSON.stringify(network), JSON.stringify(accounts)]);
							// return this.buy(cid, body.data.StockCount, pid, network)
						}
						return resolve(body);
					})
				})
				.catch(e => {
					return resolve([]);
				})
		})
	}
}

let scanActivity = new ScanActivity();

scanActivity.start();

// module.exports = ScanActivity;
//
// 购买
// https://www.cmaotai.com/YSApp_API/YSAppServer.ashx
// action: ActivityManager.newOrder
// code: 9c19b8c4b8344ac7a1ef1c6bcb45513c
// quant: 6
// del: 14
// inv: 0
// inv_mail: 0
// timestamp121: 1524468722447
