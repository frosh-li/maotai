/**
 * 新账号处理
 */

const request = require("async-request");
const fs = require('fs');
const Utils = require('../services/utils');
const Service = require('../tools/service');

class DealNewAccount {
	constructor(){

	}

	async login(account) {
		const {tel, pass} = account;
		let userAgent = Service.userAgent(tel);
		let now = (+new Date());
		let options = {
            method: 'POST',
            headers: Service.headers(userAgent),
            data: {
                action: 'UserManager.login',
                tel: tel,
                pwd: pass,
                timestamp121: now
            }
        };
        try{
	        let data = await request('https://www.cmaotai.com/API/Servers.ashx', options);
	        console.log(data);
	    }catch(e) {
	    	console.log(e);
	    }
	}

	async
}

let a = new DealNewAccount();

a.login({
	tel: 13407484255,
	pass:'qwer1234'
})