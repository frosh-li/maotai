const request = require('request');
const service = require('../tools/service');
const fs = require('fs');
var codesInterval = null;
/**
 * 账号注册接口
 */
class Registry {
	constructor() {
		// 获取验证码API地址
		this.counts = 0;
		this.vcodeApiPath = "http://api.tay8.com/msgcode/api/do.php?";
		this.init();
	}

	init() {
		this.login()
			.then((token) => {
				this.token = token;
				this.start();
			})
			.catch(e => {
				console.log(e);
			})
	}

	get MSG_URL() {
		return `${this.vcodeApiPath}action=getMessage&sid=9715&phone=13411447532&&token=F98117E24A354659801400A229B55F4B`;
	}

	get LOGIN_URL() {
		return `${this.vcodeApiPath}action=loginIn&name=lijunliang&password=qwer1234A!`;
	}

	parseUrl() {

	}

	async generatePhone() {
		let url = `${this.vcodeApiPath}action=getPhone&sid=9715&token=${this.token}&vno=0`;
		return new Promise((resolve, reject) => {
			request({
				method:'get',
				url:url,
				json:true,
			}, (err, response, body) => {
				if(err){
					return reject(err);
				}else{
					console.log(body);
					return resolve(body);
				}
			})
		})
	}

	addBlackList(phone) {
		let url = `${this.vcodeApiPath}action=addBlacklist&sid=9715&phone=${phone}&token=${this.token}`;
		request({
				method:'get',
				url:url,
				json:true,
			}, (err, response, body) => {
				if(err){
					console.log(err)
				}else{
					console.log(body);
				}
			})

		// 释放手机号
		url = `${this.vcodeApiPath}action=cancelAllRecv&sid=9715&phone=${phone}&token=${this.token}`;
		request({
				method:'get',
				url:url,
				json:true,
			}, (err, response, body) => {
				if(err){
					console.log(err)
				}else{
					console.log(body);
				}
			})
	}

	login() {
		return new Promise((resolve, reject) => {
			request({
				method:'get',
				url:this.LOGIN_URL,
				json:true,
			}, (err, response, body) => {
				if(err){
					return reject(err);
				}else{
					let [status, token] = body.split("|");
					if(status === '1'){
						return resolve(token);
					}else{
						return reject(new Error('登录失败'+body));
					}
				}
			})
		})
	}

	async start() {
		this.counts = 0;
		console.log('this.token', this.token);
		try{
			let res = await this.generatePhone();
			let [status, phone] = res.split("|");
			if(status == 1){
				console.log('手机号为', phone);
				// 开始注册流程
				let sendCode = await this.sendReg(phone);
				console.log('start send code', sendCode);
				if(sendCode && sendCode.code === 0){
					let [status, txt] = await this.getCode(phone);
					console.log('status,txt', status, txt);
					if(status == 1) {
						let vcode = txt.match(/[0-9]{6}/)[0];
						console.log(phone, vcode);
						await this.registry(phone, vcode);
					}
				}else{
					this.addBlackList(phone);
					setTimeout(() => {
						this.start();
					},40*1000)
					// this.start();
				}

			}else{
				console.log("无法获取手机号", res);
				this.start();
			}
		}catch(e) {
			console.log(e);
		}
	}

	async getSessionId(){
		return new Promise((resolve, reject) => {
			request({
				method:'get',
				url:"http://47.94.238.179/api/maotai/getSid",
				json:true,
			}, (err, response, body) => {
				if(err){
					return reject(err);
				}
				if(body.status === 200){
					return resolve(body.token);
				}else{
					return reject(new Error(body.msg));
				}
			})
		})
	}

	async registry(phone, vcode) {
		let userAgent = service.userAgent(phone);
		let that = this;
    let now = (+new Date());
    let options = {
      method: 'POST',
      url: 'https://www.cmaotai.com/API/RegMember.ashx',
      headers: service.headers(userAgent),
      form: {
      		action:'UserManager.CheckRegCode',
      		telCode:vcode,
      		pwd:'qwer1234',
      		tel:phone,
          timestamp121: now
      },
      json:true,
      jar:true
    };
    console.log('options', options.form);
    return new Promise((resolve, reject) => {
      request(options, function(error, response, body) {
          if (error) {
              return reject(error);
          }
          console.log(body);
          that.addBlackList(phone);
          return resolve(body);
      });
    })

	}

	async sendReg(phone) {
		try{
			let userAgent = service.userAgent(phone);
		  let sessid = await this.getSessionId();
		  let now = (+new Date());
		  let options = {
		      method: 'POST',
		      url: 'https://www.cmaotai.com/API/SendRegCode.ashx',
		      headers: service.headers(userAgent),
		      form: {
		      		tel:phone,
		      		sessid: sessid,
		          timestamp121: now
		      },
		      json:true,
		      jar:true
		    };
		    console.log('options', options.form);
		    return new Promise((resolve, reject) => {
		      request(options, function(error, response, body) {
		          if (error) {
		              return reject(error);
		          }
		          return resolve(body);
		      });
		    })
    }catch(e){
    	console.log('获取验证码失败', e);
    	console.log('出错了，5分钟后再试');
			setTimeout(() => {
				this.start();
			}, 60*1000*5)
		}
  }

	async getCode(phone) {
		// 获取手机验证码
		let url = `${this.vcodeApiPath}action=getMessage&sid=9715&phone=${phone}&&token=${this.token}`;
		let that = this;
		console.log(url);
		return new Promise((resolve, reject) => {
			request({
				method:'get',
				url:url,
				json:true,
			}, (err, response, body) => {
				if(err){
					return reject(err);
				}else{
					console.log(body);
					let [status, msg] = body.split("|");
					if(status == 1){
						console.log('msg', msg);
						let vcode = msg.match(/[0-9]{6}/)[0];
						console.log(phone, vcode);
						that.registry(phone, vcode)
							.then(out => {
								if(out && out.code === 0){
									console.log('注册成功',phone);
									fs.writeFileSync(`lijunliang.txt`, `${phone} 987654321\n`, {flag:'a+'});
								}
								// 开始下次注册
								setTimeout(() => {
									that.start();
								}, 60*1000)
							})
							.catch(e => {
								// 开始下次注册
								console.log('出错了，5分钟后再试');
								setTimeout(() => {
									that.start();
								}, 60*1000*5)
							})


					}else{
						this.counts++;
						if(this.counts > 50){
							that.start();
							clearTimeout(codesInterval);
							return;
						}
						codesInterval = setTimeout(() => {
							return that.getCode(phone);
						},5000)
						// return this.getCode(phone);
						// return reject(new Error('暂时无法获取验证码'));
					}
				}
			})
		})
	}
}

new Registry();
