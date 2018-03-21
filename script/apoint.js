
/**
 * 预约脚本
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
 /**
  * getAccount - 获取定量账号
  *
  * @param  {type} num description
  * @return {type}     description
  */
 function getAccount(num){
   return new Promise((resolve, reject) => {
     connection.query('select * from accounts where status=1 and remark!="汽车大厦双龙" limit 0,'+num, function(err, results){
       if(err){
         return reject(err);
       }
       return resolve(results);
     })
   })
 }


getAccount(20)
  .then(phones => {
    Service.apointmentMulti(phones, (data) => {
        console.log(data);
    })
  })
  .catch(e => {
    console.log(e);
  })
