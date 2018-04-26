/**
 * 监控活动页面
 * 每次请求5个
 */
const request = require('request');
const fs = require('fs');
const path = require('path');
const Utils = require('../services/utils');
var networks = require('../networks/520000.json');
// var networks = [
// 	{
//         "id": "152520100028",
//         "name": "贵州鸿福喜运贸易有限公司贵阳市专卖店",
//         "address": "贵阳市云岩区北京路219号银海元隆广场10栋1层3号",
//         "tel": "0851-86820969 13608509166",
//         "dname": "贵州鸿福喜运贸易有限公司"
//     }
//]

var accounts = require('../accounts/zhang_saoma.json')

const Filecookietore = require('tough-cookie-filestore');
// const accounts = require('../accounts/accounts');
console.log('网点个数',networks.length);
class ScanActivity {
	constructor(maxProcess) {
		this.maxProcess = maxProcess || 5;
		this.startIndex = 0;
		this.acts = [];
		this.cookieJar = null;
		this.account = accounts[Math.floor(Math.random()*accounts.length)];
		this.getCurrentJar(this.account.phone);
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
		if(this.startIndex > networks.length - 1){
			console.log('所有扫描结束,1分钟后继续开启扫描');
			console.log(this.acts);
			this.account = accounts[Math.floor(Math.random()*accounts.length)];
			this.getCurrentJar(this.account.phone);
			this.startIndex = 0;
			this.acts = [];
			setTimeout(() => {
				this.start();
			}, 60*1000)
			//start();
			return;
		}
		let promises = [];
		for(let i = 0 ; i < this.maxProcess ; i++,this.startIndex++){
			if(networks[this.startIndex]){
				promises.push(this.scanSingle(networks[this.startIndex]));
			}
		}
		Promise.all(promises)
			.then(datas => {
				datas.forEach(data => {
					if(data.length > 0){
						this.acts = this.acts.concat(data);
					}
				})
				this.start();
			})
			.catch(e => {
				console.log(e.message);
				this.start();
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
        jar:true
    };
    return options;
	}

	scanSingle(network) {
		console.log('网点开始检查', network.id, network.address);
		return new Promise((resolve, reject) => {
			request(this.options(network.id), (error, response, body) => {
				if(error){
					console.log(network.id, network.address,error.message);
					return resolve([]);
				}
				if(body.code === 0 && body.data.acts !== undefined && body.data.acts.length > 0){
					let ret = [];
					body.data.acts.forEach(act => {
						if((act.Pid === 391)
								||
								(act.Pid === 628)
								||
								(act.Pid === 422)
								||
								(act.Pid === 641)){
							ret.push(act);
						}
						if(act.LimitCount > 0){
							if(
								(act.Pid === 391)
								||
								(act.Pid === 628)
								||
								(act.Pid === 422)
								||
								(act.Pid === 641)
								){
								console.log('可以购买', JSON.stringify(act));
								if(act.Pid === 391){
									if(act.LimitCount >= 5){
										this.buy(act.ID, act.LimitCount,act.Pid, network)
									}
								}
							}
						}
					})
					if(ret.length > 0){
						return resolve(ret);
					}else{
						return resolve([]);
					}
				}else{
					return resolve([]);
				}
			})
		})
	}

	buy(cid, quant, pid, network){
		return new Promise((resolve, reject) => {
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
			        json:true
			    };


					request(options, (error, response, body) => {
						if(error){
							return resolve([]);
						}
						console.log('开始下单', cid,this.account.phone,this.account.pass, quant, JSON.stringify(body), JSON.stringify(network));
						if(body.code === 0 ){
							fs.writeFileSync(`output/${Utils.dateFormat()}.json`, `\n${this.account.phone} ${this.account.pass} 商品:${pid} 数量:${quant} ${JSON.stringify(network)} ${JSON.stringify(body)} ${cid}`, {flag:'a+'});
							require('child_process').fork(path.resolve(__dirname,'./buyFixedAct.js'), [pid,cid, quant, JSON.stringify(network), JSON.stringify(accounts)]);
						}else if(body.code === 3 && body.data.StockCount > 0){
							return this.buy(cid, body.data.StockCount, pid, network)
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

let scanActivity = new ScanActivity(5);

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