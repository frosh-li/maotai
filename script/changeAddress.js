const Service = require('../tools/service');
const BaiduService = require('../services/baiduService');
let assert = require("chai").assert;
let proxy = require('../controllers/proxy.js');
const Utils = require('../services/utils.js');
const logger = require('../controllers/logger');
const randomName = require("chinese-random-name");

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'accounts'
});

let results = [];
let phones = require('../notyonggui.json');

let address = [];
let index = 0;
let totalAddress = 50;
let ret2 = [];
let shopAddress = "北京市东柏街";

function randomPhone(phone, addNumber) {
    let lastCode = phone.charAt(9);
    lastCode = lastCode + addNumber;
    if(lastCode >= 10){
        lastCode = 0;
    }
    return phone.substring(0,9)+lastCode.toString()+phone.charAt(10);
}

function randomAddressName() {
  let originAddressKeyWords = [
    "超市",
    "网吧",
    "电影院",
    "茶馆",
    "棋牌室",
    "医院",
    "游泳馆",
    "游戏厅",
    "KTV",
    "麦当劳",
    "肯德基",
    "健身中心",
    "洗浴中心",
    "中国电信营业厅",
    "中国移动营业厅",
    "中国联通营业厅",
    "中国铁通营业厅",
    "中国卫通营业厅",
    "专营店",
    "古玩字画店",
    "珠宝首饰工艺品",
    "钟表店",
    "眼镜店",
    "书店",
    "音像店",
    "儿童用品店",
    "自行车专卖店",
    "礼品饰品店",
    "烟酒专卖店",
    "宠物用品店",
    "摄影器材店",
    "宝马生活方式",
    "土特产专卖店",
    "特殊买卖场所",
  ];
  let randomIndex = Math.floor(Math.random()*(originAddressKeyWords.length-1));
  return originAddressKeyWords[randomIndex];
}

let successAcount = [];
let failAccount = [];
function checkPhone(){
  let phone = phones.shift();
  if(!phone){
      console.log("预约成功列表如下");
      console.log(JSON.stringify(successAcount));
      console.log("预约失败列表如下");
      console.log(JSON.stringify(failAccount));
      return;
  }
  console.log('current phone address:', phone.addressId);
  let user = phone;
  // return;
  let userAgent = Service.userAgent(user.phone);
  console.log('index:', index);
  let currentAddress = ret2[index];
  if(!currentAddress){
    // 超出范围重置为第一个自动地址
    index = 0;
    currentAddress = ret2[index];
  }
  proxy.switchIp().then(() => {
    let currentJar = null;
    let name = randomName.generate();
    Service.getCurrentJar(user.phone)
    .then(j=>{
        currentJar = j;
        
        return Service.editAddress(
            phone.addressId,
            Utils.findProvinceCode(currentAddress.addressComponent.adcode),
            Utils.findCityCode(currentAddress.addressComponent.adcode),
            currentAddress.addressComponent.adcode,
            `${currentAddress.addressComponent.province}${currentAddress.addressComponent.city}${currentAddress.addressComponent.district}`,
            `${currentAddress.pois[0].name}`,
            name,
            randomPhone(user.phone, 0),
            zipcode="000000",
            isDef=1,
            geos[index].lng,
            geos[index].lat,
            userAgent,
            currentJar,
            )
        
    })
    .then(data => {
        logger.info(data);
        if(data.state === true && data.code === 0){
          successAcount.push(user);
          // 并且更新数据到mysql中
          let sql = `
          update accounts set 
          province=?,
          city=?,
          area=?,
          address=?,
          lat=?,
          lng=?,
          name=?
          where phone='${user.phone}'
        `;
        console.log(sql);
        let updateObj = [
          Utils.findProvinceCode(currentAddress.addressComponent.adcode),
          Utils.findCityCode(currentAddress.addressComponent.adcode),
          currentAddress.addressComponent.adcode,
          `${currentAddress.pois[0].name}`,
          geos[index].lat,
          geos[index].lng,
          name
        ];
        console.log('updateObj', updateObj);
        // 开始预约账号
        Service.apointment(phone.addressId, userAgent, 391,currentJar )
          .then(apointment => {
            console.log('apointment', apointment);
          })
          .catch(e => {
            console.log(e);
          })
        connection.query(sql, updateObj, (err, results) => {
          if(err){
            console.log(err);
          }else{
            console.log("update account", results);
          }
        })
        }else{
          failAccount.push({
            phone: user.phone,
            pass: user.pass,
            error: JSON.stringify(data)
          })
        }
        index++;
        checkPhone();
    })
    .catch(e=>{
        index++;
        console.log(e);
        failAccount.push({
            phone: user.phone,
            pass: user.pass,
            error: e.message
          })
        checkPhone();
    })
  })

}

let geos = Utils.randomGeo(30.249923, 120.176996, 5, 100);

// { country: '中国',
//     country_code: 0,
//     country_code_iso: 'CHN',
//     country_code_iso2: 'CN',
//     province: '浙江省',
//     city: '杭州市',
//     city_level: 2,
//     district: '上城区',
//     town: '',
//     adcode: '330102',
//     street: '',
//     street_number: '',
//     direction: '',
//     distance: '' }

console.log(geos);
let getAddressCounter = 0;
geos.forEach(item => {
  BaiduService.geoEnCoder(item.lat, item.lng)
    .then(addressInfo => {
      getAddressCounter++;
      ret2.push(addressInfo);
      console.log(addressInfo);
      if(getAddressCounter == geos.length){
        
        console.log('alldone');
        console.log(ret2)
        connection.query('select * from accounts where apointStatus=6  and phone!="" limit 15,15', (err, results) => {
          if(err){
            return console.log(err);
          }
          phones = results;
          checkPhone()
          console.log(phones);
        })
      }
    })
    .catch(e => {
      getAddressCounter++;
      console.log(e);
      if(getAddressCounter == geos.length){
        console.log('alldone');
        console.log(ret2)
        checkPhone()
      }
    })
})

