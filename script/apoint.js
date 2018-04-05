
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
let phones = require("../hangzhou.json");
phones = [{"phone":"13521690981","pass":"123456","status":null,"province":"110000","city":"110100","area":"110101","address":"北京市朝阳区月河胡同1号","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1935799","lat":"39.911593","lng":"116.444116","orderTime":"","apointStatus":"6","apointRemark":"预约审核收货地址高度相似异常。","ShopId":"","name":"龙翔","PayStatus":"","uid":"2072706"},{"phone":"13593493641","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"康桥饭店","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1930789","lat":"39.902786","lng":"116.469293","orderTime":"","apointStatus":"6","apointRemark":"预约审核收货地址高度相似异常。","ShopId":"","name":"翟樽","PayStatus":"","uid":"2245757"},{"phone":"13619167945","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"江边渔村","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1961857","lat":"39.900815","lng":"116.471801","orderTime":"","apointStatus":"6","apointRemark":"预约审核收货地址高度相似异常。","ShopId":"","name":"燕促杆","PayStatus":"","uid":"2265310"},{"phone":"13624666057","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"世桥国贸公寓","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1930787","lat":"39.904847","lng":"116.46972","orderTime":"","apointStatus":"6","apointRemark":"","ShopId":"","name":"秦悉帽","PayStatus":"","uid":"2245770"},{"phone":"13633696711","pass":"w070416","status":null,"province":"110000","city":"110100","area":"110101","address":"北京市东城区天坛东门东300米法华寺路南","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1935803","lat":"39.893425","lng":"116.430588","orderTime":"","apointStatus":"6","apointRemark":"预约审核收货地址高度相似异常。","ShopId":"","name":"赵利","PayStatus":"","uid":"2176436"},{"phone":"13670589613","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"张妈妈特色川味馆(百子湾店)","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1930705","lat":"39.906571","lng":"116.471846","orderTime":"","apointStatus":"6","apointRemark":"收货地址存在安全隐患。","ShopId":"","name":"储帅","PayStatus":"","uid":"2245834"},{"phone":"13700077519","pass":"123456","status":null,"province":"110000","city":"110100","area":"110105","address":"宽板凳老灶火锅(广渠门店)","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1892989","lat":"39.900075","lng":"116.481879","orderTime":"","apointStatus":"6","apointRemark":"终端设备存在安全隐患。","ShopId":"","name":"荀柚靴","PayStatus":"","uid":"2224996"},{"phone":"13764763451","pass":"123456","status":null,"province":"110000","city":"110100","area":"110101","address":"新景家园13号楼,1单元302室","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1847409","lat":"39.894711","lng":"116.42672","orderTime":"","apointStatus":"6","apointRemark":"","ShopId":"","name":"黄庆","PayStatus":"","uid":"2192997"},{"phone":"13781072791","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"LAD","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1961955","lat":"39.901159","lng":"116.472269","orderTime":"","apointStatus":"6","apointRemark":"预约审核收货地址高度相似异常。","ShopId":"","name":"孟定","PayStatus":"","uid":"2265232"},{"phone":"13792080758","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"长板凳老灶火锅","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1930706","lat":"39.896935","lng":"116.471551","orderTime":"","apointStatus":"6","apointRemark":"收货地址存在安全隐患。","ShopId":"","name":"弘亮","PayStatus":"","uid":"2245800"},{"phone":"13831322890","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"酷湘","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1962203","lat":"39.906568","lng":"116.482341","orderTime":"","apointStatus":"6","apointRemark":"手机号码格式存在安全隐患。","ShopId":"","name":"朱瑛有","PayStatus":"","uid":"2265142"},{"phone":"13839228541","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"斗城幺妹火锅","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1962229","lat":"39.897048","lng":"116.470241","orderTime":"","apointStatus":"6","apointRemark":"收货地址存在安全隐患。","ShopId":"","name":"宗朕蝙","PayStatus":"","uid":"2265115"},{"phone":"13842111030","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"食百汇美食城(双井店)","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1930791","lat":"39.899691","lng":"116.479551","orderTime":"","apointStatus":"6","apointRemark":"收货地址存在安全隐患。","ShopId":"","name":"盛徘亿","PayStatus":"","uid":"2245946"},{"phone":"13935327172","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"北京瑞斯山海酒店","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1930782","lat":"39.902719","lng":"116.472773","orderTime":"","apointStatus":"6","apointRemark":"预约审核收货地址高度相似异常。","ShopId":"","name":"经待","PayStatus":"","uid":"2245901"},{"phone":"13969577793","pass":"a123456","status":null,"province":"110000","city":"110100","area":"110105","address":"望京小腰(总店)","apointStartTime":"2018-04-04T02:00:00.000Z","apointEndTime":"2018-04-04T08:00:00.000Z","buyStartTime":"2018-04-04T02:00:00.000Z","buyEndTime":"2018-04-04T08:00:00.000Z","orderId":null,"order_status":"","addressId":"1961829","lat":"39.898533","lng":"116.472335","orderTime":"","apointStatus":"6","apointRemark":"收货地址存在安全隐患。","ShopId":"","name":"严托赖","PayStatus":"","uid":"2265252"}];
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
