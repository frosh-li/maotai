
/**
 * 获取一些账号
 */

var mysql      = require('mysql');
var request = require('request');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'accounts'
});

connection.connect();
let pois = [];
let baiduAK = "144d946a1d5c7b48c7e9a604ec5979cd";
let loc = "26.601158,106.712734|26.56837,106.693768|26.593935,106.705566|26.601742,106.719005|26.57262,106.720889";

function getAddress(loc, callback){
  let url = `http://api.map.baidu.com/geocoder/v2/?location=${loc}&output=json&pois=1&ak=${baiduAK}&batch=false`;
  request({
    url: url,
    method: 'get',
    json:true,
  }, function(error, response, body){
    if(error){
      console.log(error);
      return callback();
    }
    body.result.pois.forEach((points) => {
      let sql = `insert into address(address, lat, lng) values("贵州省贵阳市${points.addr}", "${points.point.x}","${points.point.y}")`;
      connection.query(sql, function(err, result){
        if(err){
          return console.log(err)
        }
        console.log(result);
      })
    })
    // body = JSON.parse(body);
    pois = pois.concat(body.result.pois);
    if(pois.length == 50){
      console.log('解析地址完成');
      console.log(pois);
    }
    callback();
    // console.log(pois, pois.length);
  })
}

let allloc = loc.split("|");
function stepGetAddress(){
  let loc = allloc.shift();
  if(!loc){
    return;
  }
  getAddress(loc, stepGetAddress)
}

stepGetAddress();
