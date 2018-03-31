
/**
 * 预约脚本
 */

 var mysql      = require('mysql');
 var request = require('request');
 var Service = require('../tools/service');
 // var connection = mysql.createConnection({
 //   host     : 'localhost',
 //   user     : 'root',
 //   password : '123456',
 //   database : 'accounts'
 // });

// connection.connect();
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


let _phones = [
    '13767768674',
    '15083751423',
    '13807972045',
    '18370472926',
    '18397976922',
    '13148344500',
    '13008906451',
    '13040779904',
    '13175100647',
]
let phones = require("../notyonggui.json");
// let phones = [
//     {"phone":"15288939130","pass":"123456"},
//     {"phone":"17602663277","pass":"wf1982"},
//     {"phone":"13093401696","pass":"Y199013"},
//     {"phone":"18776571180","pass":"19940j"}
// ]
// let phones = [];
// _phones.forEach(phone => {
//     phones.push({
//         phone: phone,
//         pass:"123456"
//     })
// })

    Service.apointmentMulti(phones, (data) => {
        //console.log(data);
    })
