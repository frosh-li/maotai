const Service = require('../tools/service');
const BaiduService = require('../services/baiduService');
let assert = require("chai").assert;
// 内存一共100个账号
let phones = [
// "18320488532"
// "15249625137",
// "15046846298",
// "18903188059",
// "18648747250",
// "18634641063",
// "15192468705",
// "13670589613",
// "13792080758",
// "13313181385",
// "13935327172",
// "13432527862",
// "13333176802",
// "13624666057",
// "15935492346",
// "13593493641",
// "13191162477",
// "13842111030",
// "15613794675",
// "18947646202",
"18535042686",
"15016558213",
"18535042686",
"15852871965",
"13838680531",
"15863677659",
"13664446457",
"18285280870",
"15521655884",
"18014141579",
"18732316686",
"13935327172",
"17547404498",
// "17530279117",
// "13614764139",
// "18253746241",
// "18731867215",
// "13463003759",
// "13792080758",
// "18617871057",
// "15027651759",
// "18534502751",
// "18249670105",
// "15290111971",
// 13464686175
// 15238555689
// 17853697903
// 15399293613
// 13720689056
// 13049274576
// 17854403676
// 18864854877
// 13463414918
// 18764735850
// 15835086989
// 15247493282
// 17393232815
// 15016558213
// 15665166293
// 15830750275
// 17879529656
// 13290556826
// 18743635726
// 17662411867
// 13513642792
// 13799832090
// 18698817813
// 13500156546
// 18695442661
// 15354360811
// 13223504407
// 17685571908
// 13081312422
// 15677049879
// 15837437823
// 13230672756
// 18533703270
// 18183062125
// 18438063310
// 15082907866
// 17631880252
];
// phones = [
//     '18320488532'
// ]
const names = [
  // "周曼亚",
  // "邬连中",
  // "邬连洪",
  // "田锦玉",
  // "余梦云",
  // "江丽",
  // "龙腾",
  // "刘健",
  // "徐作香",
  // "文波",
  // "邬连珍",
  "龙翔","葛徳智","刘发富","赵利","刘发壮","刘发举","徐作林","钟祥英","范娟","刘应阳","刘毅","黄丹","葛康宁","宋俊宇","李兴艳","龙小五","王欢","乔兴旺","覃芳","高洁","张发昌","熬绍芳","罗静","张竹青","刘丽","张红","刘义红","刘义霞","姚小虎","罗杰","高梅","王希","冉茂林"
]
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
            phone:phone,
            pass:"a123456"
        }
        let userAgent = Service.userAgent(user.phone);
        let currentAddress = results[index];
        Service.login(user.phone, user.pass, userAgent)
        .then(data => {
            return Service.addAddress(
                100000,
                101000,
                100010,
                `${currentAddress.province}${currentAddress.area}`,
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
      BaiduService.getPoit('北京中恒实信')
        .then(data=>{
          assert.equal(typeof data, 'object');
          results = data.results;
          console.log('results')
          console.log(results);
          checkPhone();
      })
      .catch(e=>{
          console.log(e);
          done();
      })

    })
})
