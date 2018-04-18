const Service = require('../tools/service');
const BaiduService = require('../services/baiduService');
let assert = require("chai").assert;
let proxy = require('../controllers/proxy.js');
const Utils = require('../services/utils.js');
const logger = require('../controllers/logger');
const colors = require('colors');
const randomName = require("chinese-random-name");


let results = [];
let phones = [{"phone":"13842111030","pass":"a123456","addressId":1930791}];
if(process.argv[2]!=undefined){
  phones = require(process.argv[2])
}

let address = [];
let index = 0;
let totalAddress = 50;
let ret2 = [];
let shopAddress = "北京市东柏街";

function randomPhone(phone, addNumber) {
    let lastCode = phone.charAt(8);
    lastCode = lastCode + addNumber;
    if(lastCode >= 10){
        lastCode = 0;
    }
    return phone.substring(0,8)+lastCode.toString()+phone.charAt(9)+phone.charAt(10);
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
function getRandomFour(){
  var num="";
  for(var i=0;i<4;i++){
      num+=Math.floor(Math.random()*10)
  }
  return num;
}

function getRandomLou(){
  return Math.floor(Math.random()*10);
}

function getRandomUnit() {
  return Math.floor(Math.random()*10);
}

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
  console.log(colors.green('当前已经解析:'+index+"个,成功"+successAcount.length+"个，失败"+failAccount.length+"个"));
  let currentAddress = ret2[index];
  if(!currentAddress){
    index = 0;
    currentAddress = ret2[index];
  }
  let currentJar = null;
  let name = randomName.generate();
  Service.getCurrentJar(user.phone)
    .then(j=>{
        currentJar = j;
        if(phone.addressId){
            return Service.editAddress(
                phone.addressId,
                Utils.findProvinceCode(currentAddress.addressComponent.adcode),
                Utils.findCityCode(currentAddress.addressComponent.adcode),
                currentAddress.addressComponent.adcode,
                `${currentAddress.addressComponent.province}${currentAddress.addressComponent.city}${currentAddress.addressComponent.district}`,
                `${currentAddress.pois[0].name},${getRandomLou()}号楼${getRandomUnit()}单元${getRandomFour()}室`,
                name,
                user.phone,
                zipcode="000000",
                isDef=1,
                geos[index].lng,
                geos[index].lat,
                userAgent,
                currentJar,
                )
        }else{
            // provinceId,
            // cityId,
            // districtsId,
            // addressInfo,
            // address,
            // shipTo,
            // callPhone,
            // zipcode="100000",
            // isDef=1,
            // lng,
            // lat,
            // userAgent,
            // j
            return Service.addAddress(
              Utils.findProvinceCode(currentAddress.addressComponent.adcode),
              Utils.findCityCode(currentAddress.addressComponent.adcode),
                currentAddress.addressComponent.adcode,
                `${currentAddress.addressComponent.province}${currentAddress.addressComponent.city}${currentAddress.addressComponent.district}`,
                `${currentAddress.pois[0].name},${getRandomLou()}号楼${getRandomUnit()}单元${getRandomFour()}室`,
                name,
                user.phone,
                zipcode="000000",
                isDef=1,
                geos[index].lng,
                geos[index].lat,
                userAgent,
                currentJar,
                )
        }
    })
    .then(data => {
        logger.info(data);
        if(data.state === true && data.code === 0){
          successAcount.push({
            phone: user.phone,
            pass: user.pass,
            addressId: user.addressId
          });
          index++;
          checkPhone();
          // 并且更新数据到mysql中
        }else{
          failAccount.push({
            phone: user.phone,
            pass: user.pass,
            addressId: user.addressId
          })
          index++;
          checkPhone();
        }

    })
    .catch(e=>{
        console.log(e);
        checkPhone();
    })

}
//106.630153,26.647661贵阳
//106.933425,27.725553遵义

//116.484079,39.901609
// 市中心116.402257,39.960742
// 116.432727,39.942379
// 120.611097,31.302083
// 121.626624,31.183456 上海市浦东新区长城中环墅|232号
let geos = Utils.randomGeo(31.183456, 121.626624, 15, phones.length);

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

          checkPhone()
          console.log(phones);
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
