'use strict';
/**
 * 预约相关
 */

const logger = require('../controllers/logger.js');
const proxy = require('../controllers/proxy.js');
const MaotaiService = require('../tools/service');

const fs = require('fs');

class ApointController {
	static apointStatus(user) {
		let userAgent = MaotaiService.userAgent(user.phone);
    let scopeJar = "";
    return new Promise((resolve, reject) => {


	    MaotaiService.login(user.phone, user.pass, userAgent)
	    	.then(uinfo => {
	    		return MaotaiService.getCurrentJar(user.phone)
	    	})
	      .then((j) => {
	          scopeJar = j;
	          return MaotaiService.apointStatus(userAgent, j);
	      })
	      .then(data => {
	        if(data.status == 3){
	          return resolve(data);
	        }else{
	        	return reject(new Error('预约失败:'+data.reviewInfo.split('。')[0]));
	        }
	      })
	      .catch(e => {
	        return reject(e)
	      })
	  })
	}

	static apoint(user, pid=391) {
		let userAgent = MaotaiService.userAgent(user.phone);
    let scopeJar = "";
    return new Promise((resolve, reject) => {
	    MaotaiService.login(user.phone, user.pass, userAgent)
	    	.then(uinfo => {
	    		return MaotaiService.getCurrentJar(user.phone)
	    	})
	      .then((j) => {
	          scopeJar = j;
	          return this.getAddressId(user.phone, j);
	      })
	      .then(addressId => {
	      	return this.apointment(addressId, userAgent, pid, scopeJar)
	      })
	      .then(data => {
	        if(data.status == 3){
	          return resolve(data);
	        }else{
	        	return reject(new Error('预约失败:'+data.reviewInfo.split('。')[0]));
	        }
	      })
	      .catch(e => {
	        return reject(e)
	      })
	  })
	}
}

module.exports = ApointController;