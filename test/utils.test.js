const Utils = require('../services/utils');
let assert = require("chai").assert;
const Service = require('../tools/service');

describe("工具类测试", ()=>{

    it("获取某个经纬度原型范围内的随机经纬度", (done) => {
      let randomPoints = Utils.randomGeo(39.989584, 116.480724, 2, 10);
      console.log(randomPoints);
      assert.equal(randomPoints.length, 10);
      done();
    })

    it("时间格式化", (done) => {
    	let formatDate = Utils.dateFormat();
    	console.log(formatDate);
    	assert.equal(formatDate.length, 8);
    	done();
    })

    it("测试自动获取token", (done) => {
    	Service.getToken()
    		.then(data => {
    			console.log(data);
    			assert.equal(true, true, '获取成功');
    			done();
    		})
    		.catch(e => {
    			console.log(e);
    			assert.equal(false, true, '获取失败');
    			done();
    		})
    })
})
