/**
 * 直接购买接口
 */

var logger = require('../controllers/logger');
var accounts = [];//require('../accounts/410000.json')

const request = require('request');
const path = require('path');

class CommitOrderByCode {
	constructor(code) {
		this.code = code || process.argv[2];
		this.start();
	}

	/**
	 * 开始下单接口
	 * @return {[type]} [description]
	 */
	start() {
		if(!this.code || this.code.length != 32){
			logger.info("二维码错误")
			return;
		}
		this.getActInfo(this.code)
			.then(data => {
				this.autoOrder(data.ProductId, this.code, data.LimitCount, {
					address: data.Address,
					sid: data.Sid,
					MarketPrice: data.MarketPrice,
					Price: data.Price
				})
			}).catch(e => {
				console.log(e);
			})
	}

	/**
	 * 获取二维码商品信息
	 * @return {[type]} [description]
	 */
	getActInfo(code) {
		return new Promise((resolve, reject) => {
			request({
				url:"https://www.cmaotai.com/YSApp_API/YSAppServer.ashx",
				method:"POST",
        form: {
        	action: 'ActivityManager.info',
					code: code,
					timestamp121: +new Date()
        },
        jar:true,
        json:true
			}, (error, _, body) => {
				if(error){
					logger.error(error);
					return reject(error);
				}
				if(body.code === 0 && body.data){
					return resolve({
						Price:body.data.Price,
						Id: body.data.Id,
						Sid: body.data.Sid,
						MarketPrice: body.data.MarketPrice,
						LimitCount: body.data.LimitCount,
						Address: body.data.Address,
						ProductId: body.data.ProductId
					})
				}else{
					return reject(new Error('无法获取二维码信息'));
				}
			})
		})
	}

	/**
	 * 自定下单开启
	 * @param  {[type]} pid     [description]
	 * @param  {[type]} cid     [description]
	 * @param  {[type]} quant   [description]
	 * @param  {[type]} network [description]
	 * @return {[type]}         [description]
	 */
	autoOrder(pid, cid, quant, network) {
		logger.info('自动下单开始');
		require('child_process').fork(path.resolve(__dirname,'./buyFixedActFor1399.js'), [pid,cid, quant, JSON.stringify(network), JSON.stringify(accounts)]);
	}
}

module.exports = CommitOrderByCode;
