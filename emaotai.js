var request = require("request-promise-native");

const proxy = require('./controllers/proxy');
var redis = require('redis');
var redisClient = redis.createClient();
console.log(proxy.proxyAuth);
const proxyUrl = 'http://'+proxy.proxyUser+':'+proxy.proxyPass+'@'+proxy.proxyHost+':'+proxy.proxyPort;
console.log(proxyUrl);
request = request.defaults({
    // jar: true,
    proxy: proxyUrl,
})

function getToken() {
  return new Promise((resolve, reject) => {
    redisClient.RANDOMKEY((err, reply) => {
      if(err){
        logger.error(err);
        return reject(err);
      }
      redisClient.get(reply, (err, token) => {
        if(err){
          return reject(err);
        }
        reply && redisClient.del(reply, (err) => {
          if(err){
            logger.error(err);
          }
        });
        return resolve({key:reply,token:token});
      })
    })
  })
}

const formData = { 
     action: 'Submmitorder',
     shippingType: '13',
     paymentType: '-2',
     couponCode: '',
     productSku: '9_0',
     Bundlingid: '',
     buyAmount: '5',
     from: '',
     shiptoDate: '时间不限',
     groupbuyId: '',
     remark: '',
     selectInvoice: '790284',
     session: "0152JIZgtMjy7iQLwB8JakWSUrU1Yt5p6Aeq-tEeyo4S3JNh_C9j3pvSNxOdMZ96LkL3ojMvkNyl8lhtrENljn_unah9neI7tyalqC_cMqHnbkSBmwyQXEYjmlOyiCRbeQDH-fFh-C_QHjCuna6UwPZLEDdm9lmOX5gCWrYJW9B5N_Vq1HK1Y5WQiz9-2soziMkvrT2dMbVO9gE-8vrXah6O4M-D0HYt8ugt9vM6TGEMCsKSI0isdCsaOq0YvILA_CCoty7V6GdlBXOy-Au4bu9je1GupHe4Tm19nmiWVQYVpRfU3BsJX-8-MJPAZzpD_O72LW089VfhJQ-v2-s2nPD_oG7EdOCNxH-a2R7syLq-F7f0w8kpMlee8p4RCJO0NR",
     sig: "05a1C7nT4bR5hcbZlAujcdyXquG0EzLazJTxThdXHob4AoJCU-kzEHo75C57Zd6BpKl-slCrgeBt_HY12qxHcU5B6g4AtKKf_utBpwZwq6fH9iGp4-RSlo2wwzH2kqN58c2CpydOnPbRZVAfL7MdoZjqyDmCWR84T9BYazBEiAyLEtiEqCG3fXOBt9YTnb9DgP5LFwSWKtkj8mGTql2YGfVokEcOn30tZcw06b460ree9AoMiKbnsKsROqG5ivwZDC6UiwVigUqy62iwar93Yql8GKKXJ-R5OKOKSRurVuOSQTmI0F55KjaVqXhXCwhiS4OgbBkN__RrKQy3VtsRa9ea4K9L800n5uwR_rufTnoPUeRkdUDxsyU7r0qdvdl5K3HbY7MtWx7bSEAliunrvtwMgUAiT5-7WF1iDJK0mcu7kwM7-f6C7ypmnr5XKyVdCOgZTsUhJZ9C58mFesencdbVNe_rjHb9mgyCCZkWlrCAYNFXhTCnMMdCJSSger_EQWh5yuntG3KdwSGN_Sp5Iv5qTRtAzD758JBhOAK0jWlWn1VHOjRq-NOZ3ULll7aMXHwp2kF-DlNqV1dnPfWUBODbEiJa6AbI2UKeM5QkK8okNY6qxQN5jhyZL40cRTqutiODK7bhW2M-c7MIitG1svzeC5csxMAUCFEJN1eEJdKpbSnMt2e6td-Futqxq1h96A",
     token: "FFFF00000000016A8646:1528869514005:0.8656415893614062",
     scene: 'other',
     orderSource: '4',
     chkAgree: 'true',
     sigUpProductBuy: '3',
     userguid: '' };
let reqstring = [];
for(let key in formData){
  reqstring.push(key+'='+encodeURIComponent(formData[key]));
}
console.log('content length',reqstring.join("&"), reqstring.join("&").length);
var options = { 
  method: 'post',
  url: 'https://www.emaotai.cn/API/VshopProcess.ashx',
  headers: 
   { 
     'cookie': "acw_tc=AQAAAFgF/lihMgsABEJ5alrPZrz47N6x; _uab_collina=152893854700696873716339; Hm_lvt_c3450451979c90e739797559911899fd=1528938547; _umdata=C234BF9D3AFA6FE7B37247CF044D73BE7F5AC72A7C98AB397A9A5D744FD36953C42B68B5EFF22D0FCD43AD3E795C914C4789521CBDC873CA26B64337EA0E33CC; Hm_lpvt_c3450451979c90e739797559911899fd=1528942132; .Hidistro=75DB6BF18BBB2D999AF6225E5FB3E99D5C29E7BC7900B4693B1BA57A109B5299033706814DE1FEBD2AFD298ECA5A49A49AD133D450E7437BBA680E183BD7D843F50AABDBAAC66A89ACC15780860DFA5239B654C11F19EA163A233DFC559DFED5D3DF72D93403E329340168FD8A69A8A191E8149F; SERVERID=3b9c71b0f3982dd6b5d6481518b7ae44|1528942220|1528938546",
     'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
     'accept-encoding': 'gzip, deflate, br',
     'referer': 'https://www.emaotai.cn/vshop/SubmmitOrder.aspx?productSku=9_0&sigUpProductBuy=3&buyAmount=5',
     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36',
     'x-requested-with': 'XMLHttpRequest',
     'origin': 'https://www.emaotai.cn',
     'accept': 'application/json, text/javascript, */*; q=0.01',
     'cache-control': 'no-cache',
     'pragma': 'no-cache',
     'connection': 'keep-alive',
     "proxy-authorization" : "Basic "+proxy.proxyAuth,
   },
  form: formData,
  json:true,
  };

async function startOrder(){
  try{
    let token = await getToken();
    token = JSON.parse(token.token);
    console.log(token);
    if(!token){
      console.log("无法获取到token");
      return;
    }
    options.form.session = token.csessionid;
    options.form.sig = token.sig;
    options.form.token = token.token;
    let body = await request(options)
    console.log(body);
    if(body.Status && body.Status.indexOf("Error") === -1){
        console.log('购买成功', body);
        return;
    }
    console.log(body);
    setTimeout(() => {
      startOrder();
    }, 5000)
  }catch(e){
    console.log(e)
    setTimeout(() => {
      startOrder();
    }, 5000)
  }
}

let checkStartInterval = setInterval(() => {
  let hour = (new Date()).getHours();
  console.log('当前时间', hour);
  if(hour == 10){
    clearInterval(checkStartInterval);
    startOrder();
    // startOrder();
    // startOrder();
    // startOrder();
    // startOrder();
    // startOrder();
    // startOrder();
    // startOrder();
    // startOrder();
    // startOrder();    
  }
}, 1000);


// })

