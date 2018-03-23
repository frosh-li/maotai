const Service = require('../tools/service');
const BaiduService = require('../services/baiduService');
let assert = require("chai").assert;
// 内存一共100个账号

const names = [
  "周曼亚",
  "邬连中",
  "邬连洪",
  "田锦玉",
  "余梦云",
  "江丽",
  "龙腾",
  "刘健",
  "徐作香",
  "文波",
  "邬连珍",
  "龙翔",
  "葛徳智",
  "刘发富",
  "赵利",
  "刘发壮",
  "刘发举",
  "徐作林",
  "钟祥英",
  "范娟",
  "刘应阳",
  "刘毅",
  "黄丹",
  "葛康宁","宋俊宇","李兴艳","龙小五","王欢","乔兴旺","覃芳","高洁","张发昌","熬绍芳","罗静","张竹青","刘丽","张红","刘义红","刘义霞","姚小虎","罗杰","高梅","王希","冉茂林"
]
let results = [];
let phones = require('../accounts30.txt.json');
let address = [];
let index = 0;
describe("地址测试", ()=>{
    it("获取用户地址", (done) => {
      function checkPhone(){
        let phone = phones.shift();
        if(!phone){
            done();
            return;
        }
        let user = {
            phone:phone.phone,
            pass:phone.pass
        }
        let userAgent = Service.userAgent(user.phone);
        let currentAddress = results[index];
        Service.login(user.phone, user.pass, userAgent)
        .then(data=>{
          return Service.getAddressId(user.phone)
        })
        .then(addressid => {
            return Service.editAddress(
                addressid,
                110000,
                110100,
                110101,
                `北京市东城区`,
                `${currentAddress.address}${currentAddress.name}`,
                names[index],
                user.phone,
                zipcode="100000",
                isDef=1,
                currentAddress.location.lng,
                currentAddress.location.lat,
                userAgent)
        })
        .then(data => {
            index++;
            console.log(data);
            // assert.equal(data.length === 0, true)
            checkPhone();
        })
        .catch(e=>{
            console.log(e);
            assert.equal(false, true);
            checkPhone();
        })


      }
      // 北京中恒实信  丰台
      // 金源腾达      大兴
      let startPage = 0;
      BaiduService.getPoit('雍贵中心',startPage)
        .then(data=>{
          assert.equal(typeof data, 'object');
          results = results.concat(data.results);
          if(results.length < phones.length){
            startPage++;
            return BaiduService.getPoit('雍贵中心', startPage);
          }else{
            console.log('共获取到地址', results.length, '个');
            checkPhone();
          }
      })
      .then(data => {
        // assert.equal(typeof data, 'object');
        results = results.concat(data.results);
        if(results.length < phones.length){
          startPage++;
          return BaiduService.getPoit('雍贵中心', startPage);
        }else{
          console.log('共获取到地址', results.length, '个');
          checkPhone();
        }
      })
      .then(data => {
        if(data){
          // assert.equal(typeof data, 'object');
          results = results.concat(data.results);
          if(results.length < phones.length){
            startPage++;
            return BaiduService.getPoit('雍贵中心', startPage);
          }else{
            console.log('共获取到地址', results.length, '个');
            checkPhone();
          }
        }
      })
      .catch(e=>{
          console.log(e);
          done();
      })

    })
})
