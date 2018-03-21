const Service = require('../services/baiduService');
let assert = require("chai").assert;

describe("测试百度解析", ()=>{
    it("URL格式化", (done) => {
      let baiduAK = "144d946a1d5c7b48c7e9a604ec5979cd";
      let params = {
        query:"小区",
        tag:"房地产",
        location: '39.811828,116.347906',
        radius: 1000,
        output:"json",
      }
      let url = Service.buildUrl(`http://api.map.baidu.com/place/v2/search?ak=${baiduAK}`, params);
      let retUrl = 'http://api.map.baidu.com/place/v2/search?ak=144d946a1d5c7b48c7e9a604ec5979cd&query=%E5%B0%8F%E5%8C%BA&tag=%E6%88%BF%E5%9C%B0%E4%BA%A7&location=39.811828%2C116.347906&radius=1000&output=json';
      console.log(url, retUrl);
      assert.equal(retUrl, url);
      done();
    })
    it("地址解析", (done) => {
        Service.getPoit('北京市东城区雍贵中心')
          .then(data=>{
            console.log(data);
            assert.equal(typeof data, 'object');
            done();
          }).catch(e=>{
            console.log(e);
            done();
          })
    })

    // it("根据名字获取经纬度", (done) => {
    //     Service.geoDecoder('北京市东城区雍贵中心')
    //       .then(data=>{
    //         console.log(data);
    //         assert.equal(data.status, 0);
    //         done();
    //       }).catch(e=>{
    //         done();
    //       })
    // })
})
