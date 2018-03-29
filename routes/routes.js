var express = require('express');
var router = express.Router();
var AliVerify = require('../tools/startAliVerify');
var MaotaiService = require('../tools/service');
var uuid = require('uuid/v4');
var request = require('request');
const proxy = require('../controllers/proxy');


/**
 * router - 获取sid
 *
 * @param  {type} '/maotai'    description
 * @param  {type} function(req description
 * @param  {type} res          description
 * @param  {type} next         description
 * @return {type}              description
 */
router.post('/maotai', function(req, res, next) {
  let sid = req.body.sid;
  aliSessionId = sid;
  redisClient.setex('ali:token:'+uuid(), 60, sid);
  console.log('SID from Android', sid);
  res.json({
    status: 200,
    sid: sid
  })
});

router.get('/maotai/sid/', function(req, res, next){
  res.json({
    status: 200,
    sid: aliSessionId
  })
})

router.post('/maotai/updateSid', function(req, res,next){
  AliVerify.connectSidFromHard().then(data => {
    if(data === true){
      res.json({
        status: 200
      })
    }
  }).catch(e=>{
    console.log(e);
    res.json({
      status: 500,
      msg: e.msg
    })
  });
})
router.post('/maotai/login', (req, res, next) => {
  let tel = req.body.tel,
      pass = req.body.pass;
  MaotaiService.login(tel, pass).then(data => {
    if(data.code === 0){
      return res.json(data)
    }else{
      return res.json({
        status: 500,
        data:data
      })
    }
  }).catch(e=>{
    return res.json({
      status: 500,
      tel:tel,
      pass:pass,
      e: e.message
    })
  })
})

router.post('/maotai/createOrder', (req, res, next) => {
  let tel = req.body.tel;
  let pid = req.body.pid;
  let quantity = req.body.quantity || 1;
  MaotaiService.createOrder(tel, pid , quantity)
    .then(data => {
      if(data.code === 0){
        return res.json(data)
      }else{
        return res.json({
          status: 500,
          data:data
        })
      }

    }).catch(e=>{
      return res.json({
        status: 500,
        msg: e.message
      })
    })
})

router.post('/maotai/multiApointment', (req, res, next) => {
  let phones = req.body.tels.split(",");
  MaotaiService.apointmentMulti(phones, (data) => {
    res.json({
      status: 200,
      data:data
    })
  })
})

router.post('/maotai/apointment', (req, res, next) => {
  let phone = req.body.tel;
  MaotaiService._apointmentBySinglePhone(phone, (data) => {
    res.json({
      status: 200,
      data:data
    })
  })
})

router.post('/maotai/getOrder/', (req, res, next) => {
  let user = req.body.tel;
  let pass = req.body.pass;
  MaotaiService.getOrder(user,pass)
    .then(data => {
      return res.json({
        status: 200,
        data: data
      })
    })
    .catch(e => {
      return res.json({
        status: 500,
        error:e.message
      })
    })
})

router.post('/maotai/multiOrder', (req, res, next) => {
  console.log(req.body.tels);
  let tels = req.body.tels.split("|");      // 电话
  let pid = req.body.pid;                   // 酒品编号 飞天茅台53° 为391
  let quantity = req.body.quantity || 1;    // 订购数量瓶
  let fixedShopName = req.body.shopName || -1 ; // 网点ID  211110105003 雍贵中心
  let ret = [];
  function createOne() {
    let tel = tels.shift();
    if(!tel){
      return res.json({
        status: 200,
        msg:"alldone",
        datas: ret
      })
    }
    let userAgent = MaotaiService.userAgent(tel);
    proxy.switchIp().then(()=>{
      MaotaiService.createOrder(JSON.parse(tel), pid , quantity,userAgent, fixedShopName)
        .then(data => {
          if(data.code === 0){
            ret.push({
              tel: tel,
              status: "SUCCESS",
              data: data
            })
            console.log('create order success', tel, pid,JSON.stringify(data));
            setTimeout(createOne, 1000);
          }else{
            console.log('create order fail', tel, pid,JSON.stringify(data));
            ret.push({
              tel: tel,
              status: "FAIL",
              data: data
            })
            setTimeout(createOne, 1000);
          }

        }).catch(e=>{
          ret.push({
            tel: tel,
            status: "FAIL",
            error:e.message
          })
          console.log('create order fail', tel, pid, e.message);
          if(e.message == "该网点无库存或可购买数量不够"){
            // 如果没有库存就不需要继续下一步
            console.log("所有货物都已经被洗刷一空，无法购买更多了");
            tels.length = 0;
            return res.json({
              status: 200,
              msg:"alldone",
              datas: ret
            })
          }else{
            setTimeout(createOne, 1000);
          }
        })
    })
    .catch(e => {
      console.log(e);
    })

  }
  setTimeout(createOne, 1000);


})
let userAgent = 'Mozilla/1.6.0 (Linux; U; Android 5.0.0; SM-G900P Build/V312IR)';
router.get('/wireless/pageload.json', function(req, res, next){
   // /wireless/pageload.json?&h=451&w=555&a=FFFFA0000000016A858A
   //let userAgent = 'iPhone; CPU iPhone OS 10_4 like Mac OS X';
   console.log(userAgent)
  proxy.switchIp().then(()=>{
    request = request.defaults({
        jar: true,
        proxy: 'http://'+proxy.proxyUser+':'+proxy.proxyPass+'@'+proxy.proxyHost+':'+proxy.proxyPort,
    })
    let url = `https://cf.aliyun.com/wireless/pageload.json?&h=${req.query.h}&w=${req.query.w}&a=${req.query.a}`;
    console.log(url);
    return new Promise((resolve, reject) => {
      request(
        {
          url: url,
          method:"get",
          headers: {
            "proxy-authorization" : "Basic " + this.proxyAuth,
            "user-agent": userAgent
          },
          json:true
        }, function(error, response, body){
        if(error){
          console.log(error);
          return res.json({
            status: 500,
            error: error.message
          })
        }
        console.log('代理:',body);
        return res.json(body)
      })
    })
  })
})

router.get('/router/rest', function(req, res, next){
   // /wireless/pageload.json?&h=451&w=555&a=FFFFA0000000016A858A
   //let userAgent = 'iPhone; CPU iPhone OS 10_4 like Mac OS X';
   console.log(userAgent)
   proxy.switchIp().then(()=>{
    request = request.defaults({
        jar: true,
        proxy: 'http://'+proxy.proxyUser+':'+proxy.proxyPass+'@'+proxy.proxyHost+':'+proxy.proxyPort,
    })
    let url = `https://eco.taobao.com/router/rest?`;
    let params = [];
    for(var key in req.query){
      params.push(key+"="+req.query[key]);
    }
    url += params.join("&");
    console.log(url);
    return new Promise((resolve, reject) => {
      request(
        {
          url: url,
          method:"get",
          headers: {
            "proxy-authorization" : "Basic " + this.proxyAuth,
            "user-agent": userAgent,
            "content-type":"text/javascript;charset=UTF-8"
          },
          json:true
        }, function(error, response, body){
        if(error){
          console.log(error);
          return res.json({
            status: 500,
            error: error.message
          })
        }
        console.log('代理:',body);
        return res.json(body)
      })
    })
  })
})

//https://cf.aliyun.com/wireless/nocaptcha.json
//

router.post('/wireless/nocaptcha.json', function(req, res, next) {
  request = request.defaults({
      jar: true,
      proxy: 'http://'+proxy.proxyUser+':'+proxy.proxyPass+'@'+proxy.proxyHost+':'+proxy.proxyPort,
  })
  let url = `https://cf.aliyun.com/wireless/nocaptcha.json`;
  console.log(url);
  //console.log(JSON.stringify(req.body));
  // Dalvik/1.6.0 (Linux; U; Android 4.4.4; MuMu Build/V417IR)
  // Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Mobile Safari/537.36
  // Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1

  console.log(userAgent)
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        method:"post",
        headers: {
          "proxy-authorization" : "Basic " + this.proxyAuth,
          "user-agent": userAgent,
          "content-type": 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        form: {
          time: req.body.time,
          a: req.body.a,
          t: req.body.t,
          w: req.body.w,
          n: req.body.n
        },
        json:true
      }, function(error, response, body){
      if(error){
        console.log(error);
        return res.json({
          status: 500,
          error: error.message
        })
      }
      console.log('代理:',body);
      return res.json(body)
    })
  })
})

module.exports = router;
