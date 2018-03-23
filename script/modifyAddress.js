
/**
 * 获取一些账号
 */

var mysql      = require('mysql');
var request = require('request');
var Service = require('../tools/service');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'accounts'
});

connection.connect();

const names = [
  "周曼亚","邬连中","邬连洪","田锦玉","余梦云","江丽","龙腾","刘健","徐作香","文波","邬连珍","龙翔","葛徳智","刘发富","赵利","刘发壮","刘发举","徐作林","钟祥英","范娟","刘应阳","刘毅","黄丹","葛康宁","宋俊宇","李兴艳","龙小五","王欢","乔兴旺","覃芳","高洁","张发昌","熬绍芳","罗静","张竹青","刘丽","张红","刘义红","刘义霞","姚小虎","罗杰","高梅","王希","冉茂林"
]
console.log(names.length);
/**
 * getAccount - 获取定量账号
 *
 * @param  {type} num description
 * @return {type}     description
 */
function getAccount(num){
  return new Promise((resolve, reject) => {
    connection.query('select * from accounts where status=1 and remark="汽车大厦双龙" limit 11,'+num, function(err, results){
      if(err){
        return reject(err);
      }
      return resolve(results);
    })
  })
}

function start() {
  let accounts = require('../accounts30.txt.json');
  addressEdit(accounts,30);
}

function getRandomAddress(count){
  return new Promise((resolve, reject) => {
    connection.query("select * from address limit 0,"+count, function(err, results){
      if(err){
        return reject(count);
      }
      return resolve(results);
    })
  })

}

function addressEdit(accounts, count){
  let acc = accounts.shift();
  if(!acc){
    console.log('账号修改完成');
    return;
  }
  let currentIndex = count - accounts.length - 1;
  let userAgent = Service.userAgent(acc.phone);
  let addressID = null;
  Service.login(acc.phone, acc.pass, userAgent)
    .then(()=>{
      return Service.getAddressId(acc.phone, userAgent);
    })
    .then((addressid) => {
      addressID = addressid
      return getRandomAddress(count);
    })
    .then((data) => {
      let cData = data[currentIndex];
      return Service.editAddress(
        addressID,
        '110000',
        '110100',
        '110101',
        '北京市东城区',
        cData.address,
        names[currentIndex+10],
        acc.phone,
        zipcode="000000",
        isDef=1,
        cData.lat,
        cData.lng,
        userAgent);
    })
    .then(() => {
      console.log('账号修改完成',acc.phone,acc.pass);
      setTimeout(()=>{
          addressEdit(accounts, count)
      },3000);
    })
    .catch(e => {
      console.log(e);
    })
}

start();
