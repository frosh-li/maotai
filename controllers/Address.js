const request = require('request');
const Service = require('../tools/service');
/**
 * 地址相关问题
 */

 class Address {

   /**
    * addressEdit - 修改地址
    * 前提必须是添加过地址的账号
    *
    * @param  {type} accounts description
    * @param  {type} count    description
    * @return {type}          description
    */
   addressEdit(accounts, count){
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
           '110115',
           '北京市大兴区',
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
 }
