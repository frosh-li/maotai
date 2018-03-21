var express = require('express');
var router = express.Router();
var AliVerify = require('../tools/startAliVerify');
var MaotaiService = require('../tools/service');
var uuid = require('uuid/v4');


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
  // redisClient.setex('ali:token:'+uuid(), 60, sid);
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
      pass:pass
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

router.post('/maotai/multiOrder', (req, res, next) => {
  console.log(req.body.tels);
  let tels = req.body.tels.split("|");      // 电话
  let pid = req.body.pid;                   // 酒品编号 飞天茅台53° 为391
  let quantity = req.body.quantity || 1;    // 订购数量瓶
  let fixedShopId = req.body.shopid || -1 ; // 网点ID  211110105003 雍贵中心
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
    MaotaiService.createOrder(JSON.parse(tel), pid , quantity,userAgent, fixedShopId)
      .then(data => {
        if(data.code === 0){
          ret.push({
            tel: tel,
            status: "SUCCESS",
            data: data
          })
          console.log('create order success', tel, pid,'error');
          setTimeout(createOne, 1000);
        }else{
          console.log('create order fail', tel, pid,'error');
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
        console.log('create order fail', tel, pid,'error', e.message);
        setTimeout(createOne, 1000);
      })
  }
  setTimeout(createOne, 1000);
})

module.exports = router;
