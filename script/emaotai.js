const request = require('request');
const fs = require('fs');
const path = require('path');
//const js

class Login {
	constructor() {
		this.__viewstate = '';
		this.sig = '';
		this.sid = '';
	}

	async reqLoginPage() {
		return new Promise((resolve, reject)=> {
			request({
				url: "https://www.emaotai.cn/login.aspx",
				method: 'get',
				jar:true,
			}, (error, _, body)=>{
				if(error){
					throw new Error(error);
				}
				return resolve(body);
			})
		})
	}

	async reqLoginPageLocal() {
		return new Promise((resolve, reject)=> {
			fs.readFile(path.resolve(__dirname,'../maotai.html'), function(error, data){
				if(error){
					throw new Error(error);
				}
				return resolve(data.toString('utf-8'));
			})
		})
	}

	async run() {
		try{
			let pagedata = await this.reqLoginPage();
			// console.log(pagedata);
			let __viewstate = pagedata.match(/<input\s+type\=\"hidden\"\s+name\=\"__VIEWSTATE\"\s+id="__VIEWSTATE"\s+value=\"([^\"]+)\"\s/m);
			console.log("-------")
			console.log(__viewstate[1]);
			if(__viewstate && __viewstate.length > 0){
				this.__viewstate = __viewstate[1];
			}
			this.startLogin();
			//<input type="hidden" name="__LASTFOCUS" id="__LASTFOCUS" value="" />
			//<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwULLTE3MzA1ODMyMTVkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQ5sb2dpbiRjaGtBZ3JlZQ==" />

		}catch(e){
			console.log(e);
		}


	}

	formInit(__VIEWSTATE, sid, sig) {
		return {
			__LASTFOCUS: '',
			__VIEWSTATE: '',
			__EVENTTARGET: '',
			__EVENTARGUMENT: '',
			login$txtUserName: '15330066919',
			login$txtPassword: '110520',
			login$csessionid: sid,
			login$sig: sig,
			login$token: 'FFFF00000000016A8646:1527398675520:0.46426811007029767',
			login$scene: 'login',
			login$chkAgree: 'on',
			login$btnLogin: '立即登录',
			login$txtIsYZPhone: 0,
		}
	}

	startLogin() {
		return new Promise((resolve, reject)=> {
			request({
				url: "https://www.emaotai.cn/login.aspx",
				method: 'post',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
				},
				form: this.formInit(this.__viewstate, this.sid, this.sig),
				jar:true,
			}, (error, _, body)=>{
				if(error){
					throw new Error(error);
				}
				console.log(body);
				return resolve(body);
			})
		})
	}
}

let login = new Login();

login.run();