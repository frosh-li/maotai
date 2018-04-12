
/**
 * 预约脚本
 */

 var mysql      = require('mysql');
 var request = require('request');
 var Service = require('../tools/service');

if(process.argv[2]!=undefined){
  phones = require(process.argv[2]);
}
console.log(phones);
Service.apointmentMulti(phones, (data) => {

    //console.log(data);
})
