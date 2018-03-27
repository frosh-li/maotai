const Service = require('../tools/service');
const BaiduService = require('../services/baiduService');
let assert = require("chai").assert;
// 内存一共100个账号
//求两个字符串的相似度,返回差别字符数,Levenshtein Distance算法实现
function Levenshtein_Distance(s,t){
    var n=s.length;// length of s
    var m=t.length;// length of t
    var d=[];// matrix
    var i;// iterates through s
    var j;// iterates through t
    var s_i;// ith character of s
    var t_j;// jth character of t
    var cost;// cost
    // Step 1
    if (n == 0) return m;
    if (m == 0) return n;
    // Step 2
    for (i = 0; i <= n; i++) {
        d[i]=[];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    // Step 3
    for (i = 1; i <= n; i++) {
        s_i = s.charAt (i - 1);
        // Step 4
        for (j = 1; j <= m; j++) {
            t_j = t.charAt (j - 1);
            // Step 5
            if (s_i == t_j) {
                cost = 0;
            }else{
                cost = 1;
            }
            // Step 6
            d[i][j] = Minimum (d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + cost);
        }
    }
    // Step 7
    return d[n][m];
}

//求两个字符串的相似度,返回相似度百分比
function Levenshtein_Distance_Percent(s,t){
    var l=s.length>t.length?s.length:t.length;
    var d=Levenshtein_Distance(s,t);
    return (1-d/l).toFixed(4);
}

//求三个数字中的最小值
function Minimum(a,b,c){
    return Math.min(a, b, c);
}

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
//let phones = require('../accounts.json');
let phones = require("../accounts/zhuxiaodi2.json");
// phones.length = 5;
let address = [];
let index = 0;
let totalAddress = 50;
let ret2 = [];
let shopAddress = "兰州市甘南路";
describe("地址测试", ()=>{
    it("获取用户地址", (done) => {
      function checkPhone(){
        console.log(phones, phones.length);

        let phone = phones.shift();
        if(!phone){
            done();
            return;
        }
        let user = {
            phone:phone.phone,
            pass:phone.pass
        }
        // return;
        let userAgent = Service.userAgent(user.phone);
        console.log('index:', index);
        let currentAddress = ret2[index];
        Service.login(user.phone, user.pass, userAgent)
        .then(data=>{
          return Service.getAddressId(user.phone)
        })
        .then(addressid => {
            console.log("是否获取到ID", addressid);
            if(addressid){
              return Service.editAddress(
                  addressid,
                  620000,
                  620100,
                  620102,
                  `甘肃省兰州市城关区`,
                  `${currentAddress.address}`,
                  names[index],
                  user.phone,
                  zipcode="620000",
                  isDef=1,
                  currentAddress.location.lng,
                  currentAddress.location.lat,
                  userAgent)
            }else{
              return Service.addAddress(
                  620000,
                  620100,
                  620102,
                  `甘肃省兰州市城关区`,
                  `${currentAddress.address}`,
                  names[index],
                  user.phone,
                  zipcode="620000",
                  isDef=1,
                  currentAddress.location.lng,
                  currentAddress.location.lat,
                  userAgent)
            }
        })
        .then(data => {
            index++;
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
      BaiduService.getPoit(shopAddress,startPage)
        .then(data=>{
          results = results.concat(data.results);
          startPage++;
          return BaiduService.getPoit(shopAddress, startPage);
      })
      .then(data => {
          results = results.concat(data.results);
          startPage++;
          return BaiduService.getPoit(shopAddress, startPage);
      })
      .then(data => {
          results = results.concat(data.results);
          startPage++;
          return BaiduService.getPoit(shopAddress, startPage);
      })
      .then(data => {
          results = results.concat(data.results);
          startPage++;
          return BaiduService.getPoit(shopAddress, startPage);
      })
      .then(data=>{
        ret2 = [];
        results.forEach(item => {

          let canPush = true;
          ret2.forEach(citem => {
            let sim = Levenshtein_Distance_Percent(citem.name, item.name);
            if(sim > 0.5){
              canPush = false;
            }
          })
          if(canPush) {
            ret2.push(item)
          }
        })
        console.log(ret2, ret2.length);
        checkPhone();
      })
      .catch(e=>{
          console.log(e);
          done();
      })

    })
})
