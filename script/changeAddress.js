const Service = require('../tools/service');
const BaiduService = require('../services/baiduService');
let assert = require("chai").assert;
let proxy = require('../controllers/proxy.js');
const Utils = require('../services/utils.js');
const logger = require('../controllers/logger');
const randomName = require("chinese-random-name");


let results = [];
let phones = [
  {
        "phone": "18201603185",
        "pass": "123456",
        "addressId": 1884119
    },
    {
        "phone": "18207517996",
        "pass": "123456",
        "addressId": 1829922
    },
    {
        "phone": "18333966217",
        "pass": "123456",
        "addressId": 1879800
    },
    {
        "phone": "18382394514",
        "pass": "123456",
        "addressId": 1840503
    },
    {
        "phone": "18629896680",
        "pass": "123456",
        "addressId": 1872179
    }
];
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
            `${currentAddress.pois[0].name},${getRandomFour()}`,
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

          // 并且更新数据到mysql中

          // 开始预约账号
          Service.apointment(phone.addressId, userAgent, 391,currentJar )
            .then(apointment => {
              apointment = JSON.parse(apointment);
              console.log('apointment', apointment);
              if(apointment.state === true && apointment.code === 0){
                successAcount.push({
                  phone: user.phone,
                  pass: user.pass,
                  addressId: user.addressId
                });
              }else{
                failAccount.push({
                  phone: user.phone,
                  pass: user.pass,
                  addressId: user.addressId
                })
              }
              index++;
              checkPhone();
            })
            .catch(e => {
              console.log(e);
              index++;
              checkPhone();
            })
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
        index++;
        console.log(e);
        failAccount.push({
            phone: user.phone,
            pass: user.pass,
            addressId: user.addressId
          })
        checkPhone();
    })
  })

}
//106.630153,26.647661贵阳
//106.933425,27.725553遵义
//116.484079,39.901609
let geos = Utils.randomGeo(39.901609, 116.484079, 5, phones.length);

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

