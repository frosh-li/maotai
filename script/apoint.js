
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
     connection.query('select * from accounts where status=1 and remark="汽车大厦双龙" limit 0,'+num, function(err, results){
       if(err){
         return reject(err);
       }
       return resolve(results);
     })
   })
 }
let phones =[
  {
      phone: "15063527328",
      pass: "123456"
  },
  {
      phone: "15610959065",
      pass: "123456"
  },
  {
      phone: "13907971151",
      pass: "w011765"
  }
  ,
  {
      phone: "15075870950",
      pass: "123456"
  }
  ,
  {
      phone: "13102661153",
      pass: "123456"
  }
  ,
  {
      phone: "19909021857",
      pass: "jyx741118"
  }
  ,
  {
      phone: "15234324013",
      pass: "654321"
  }
  ,
  {
      phone: "13465386355",
      pass: "anjiaqi112828"
  }
  ,
  {
      phone: "18161154033",
      pass: "zjq741118"
  }
  ,
  {
      phone: "13165188009",
      pass: "123456"
  }
];

getAccount(40)
  .then(phones => {
    Service.apointmentMulti(phones, (data) => {
        console.log(data);
    })
  })
  .catch(e => {
    console.log(e);
  })
