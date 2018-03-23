
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
    "15249625137",
    "15046846298",
    "18903188059",
    "13670589613",
    "13792080758",
    "13935327172",
    "13333176802",
    "13624666057",
    "15935492346",
    "13593493641",
    "13191162477",
    "13842111030",
    "15613794675",
]
let phones = require("../accounts30.txt.json");
// _phones.forEach(phone => {
//     phones.push({
//         phone: phone,
//         pass:"a123456"
//     })
// })

    Service.apointmentMulti(phones, (data) => {
        console.log(data);
    })
