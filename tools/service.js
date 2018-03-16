var request = require("request");
request = request.defaults({jar: true});
var AliVerify = require('./startAliVerify');
const crypto = require('crypto');
const uuid = require('uuid/v4');


class MaotaiService {
  md5(str) {
    let _md5 = crypto.createHash('md5');
    let result = _md5.update(str).digest('hex');
    return result.toLowerCase();
  }

  userAgent() {
    let os = "android";
    let version = "1.0.23";
    let appIndent = this.md5(uuid());
    let signString = "7c60b232d79d34d727c12c6f33ad8fea29ebb333ae0c1b3822e5a18934c8f189";
    let appIndentSign = this.md5([os, version,appIndent,signString].join("-"));
    return `Mozilla/5.0 (Linux; Android 4.4.4; LA2-SN Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[${os}/${version}/${appIndent}/${appIndentSign}]`;
  }
  /**
   * login - 登录
   *
   * @param  {type} tel  description
   * @param  {type} pass description
   * @return {type}      description
   */
  login(tel, pass='123456', userAgent){
    userAgent = userAgent || this.userAgent();
    let now = +new Date();
    if(tel == "15330066919"){
      pass="110520";
    }
    let randomMD5 = "8bf81d40806ffb9614867197b8e33243";
    let options = { method: 'POST',
      url: 'https://www.cmaotai.com/API/Servers.ashx',
      headers:
       {
         'cache-control': 'no-cache',
         'accept-language': 'zh-CN,en-US;q=0.8',
         accept: 'application/json, text/javascript, */*; q=0.01',
         'content-type': 'application/x-www-form-urlencoded',
         referer: 'https://www.cmaotai.com/ysh5/page/LoginRegistr/userLogin.html',
         'user-agent': userAgent,
         'x-requested-with': 'XMLHttpRequest' },
      form:
       { action: 'UserManager.login',
         tel: tel,
         pwd: pass,
         timestamp121: now } };
    console.log('useragent login', options.headers);
    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          return reject(error);
        }
        console.log(body);
        body = JSON.parse(body);
        if(body.state === true && body.code === 0){
          return resolve(body);
        }else{
          return reject(new Error(body.msg));
        }
      });
    })
  }
  checkAliToken(callback) {

      if(!aliSessionId){
        setTimeout(()=>{
          this.checkAliToken(callback);
        },100);
        //return process.nextTick(()=>{this.checkAliToken()});
        // return this.checkAliToken();
      }else{

          console.log('token成功获取到',aliSessionId);
          callback(aliSessionId);

      }



  }
  /**
   * createOrder - 创建订单
   *
   * @param  {type} tel        description
   * @param  {type} sid        description
   * @param  {type} pid        description
   * @param  {type} quantity=1 description
   * @return {type}            description
   */
  createOrder(tel, pid , quantity=1, userAgent) {
    userAgent = userAgent || this.userAgent();
    let now = +new Date();
    console.log('useragent createorder', userAgent);
    return new Promise((resolve, reject) => {
      this.login(tel, tel === "15330066919"?"110520":"123456", userAgent)
        .then(data => {
          AliVerify.connectSidFromHard().then(data => {
            if(data === true){
              this.checkAliToken(
                (aliSessionId)=>{
                  this.getAddressId(tel).then(address =>{
                    let options = { method: 'POST',
                      url: 'https://www.cmaotai.com/API/CreateOrder.ashx',
                      headers:
                       {
                         'cache-control': 'no-cache',
                         'accept-language': 'zh-CN,en-US;q=0.8',
                         accept: 'application/json, text/javascript, */*; q=0.01',
                         'content-type': 'application/x-www-form-urlencoded',
                         referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                         'user-agent': userAgent,
                         'x-requested-with': 'XMLHttpRequest' },
                      form:
                       { phoneCode: tel,
                         productId: pid,
                         quantity: quantity,
                         couponsId: '7a971dbc622643db96118c938277c64f',
                         addressId: address,
                         invioceId: -1,
                         express: 14,
                         shopId: '211110105003',
                         sessid: aliSessionId,
                         remark: '',
                         subinfoId: '',
                         timestamp121: now } };
                    aliSessionId = null;
                    request(options, function (error, response, body) {
                      if (error){
                        return reject(error);
                      };
                      console.log('下单结果',body);
                      return resolve(JSON.parse(body));
                    });
                  })
                });
            }
          }).catch(e=>{
            return reject(e);
          });

        }).catch(e => {
          return reject(e);
        })

    })


  }

  getAddressId(tel) {
    console.log('start get addressID from mobile:', tel);
    let now = +new Date();
    var options = { method: 'POST',
      url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
      headers:
       { 'postman-token': '5c885fd4-6b0a-21ff-0bf2-3f35526c6973',
         'cache-control': 'no-cache',
         'content-type': 'application/x-www-form-urlencoded' },
      form:
       { action: 'AddressManager.list',
         index: '1',
         size: '10',
         timestamp121: now } };
    return new Promise((resolve,reject) => {
      function getFromRemote() {
        request(options, function (error, response, body) {
          if (error){
            return reject(error);
          }
          redisClient.set(`address:${tel}`, body);
          let bodyJSON = JSON.parse(body);
          console.log(bodyJSON.data.list[0])
          console.log('获取的地址id',bodyJSON.data.list[0].SId);
          return resolve(bodyJSON.data.list[0].SId);

        });
      }
      getFromRemote();
      // redisClient.get(`address:${tel}`, (err, addresses)=>{
      //   if(err){
      //     getFromRemote();
      //   }else{
      //     if(addresses){
      //       let bodyJSON = JSON.parse(addresses);
      //       console.log(bodyJSON.data.list[0])
      //       console.log('获取的地址id from redis',bodyJSON.data.list[0].SId);
      //       return resolve(bodyJSON.data.list[0].SId);
      //     }else{
      //       getFromRemote();
      //     }
      //   }
      // })

    })
  }


  /**
   * apointment - 预约
   *
   * @param  {type} addressID description
   * @param  {type} pid=391   description
   * @return {type}           description
   */
  apointment(addressID, userAgent, pid=391) {
    userAgent = userAgent || this.userAgent();
    let now = +new Date();
    var options = { method: 'POST',
      url: 'https://www.cmaotai.com/API//Servers.ashx',
      headers:
       {
         'cache-control': 'no-cache',
         'accept-language': 'zh-CN,en-US;q=0.8',
         accept: 'application/json, text/javascript, */*; q=0.01',
         'content-type': 'application/x-www-form-urlencoded',
         referer: `https://www.cmaotai.com/ysh5/page/Reservations/SelectAddress.html`,
         'user-agent': userAgent,
         'x-requested-with': 'XMLHttpRequest' },
      form:
       { action: 'ReservationsManager.Regist',
         addressID: addressID,
         pid: pid,
         timestamp121: now } };
    console.log('useragent 预约', userAgent);
    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error){
          console.log(error);
          return reject(error);
        }
        else{
          console.log("预约结果", body);
          let ret = JSON.stringify(body);
          if(body.state === false){
            return reject("预约失败:"+body.msg);
          }
          return resolve(body);
        }
      });
    })
  }


  /**
   * 15083508622 ,15961949288 ,17640535303 ,13780531320 ,13363361636 ,13814576156 ,13838581852 ,17771931836 ,17320598015 ,13597871858 ,13297744131 ,13877402131 ,18818454020 ,17303062479 ,17605905790 ,13871277826 ,15398051067 ,18792922235 ,15958598699 ,17771931836 ,15028917633 ,13363794153 ,18031974453 ,15354094337 ,15354195973 ,15220828165 ,13570755623
   * apointmentMulti - 批量预约接口
   * 1、登录
   * 2、获取默认地址
   * 3、预订
   * @param  {type} phones description
   * @return {type}        description
   */
  apointmentMulti(phones, callback) {
    // let phone;
    // console.log('开始预约:', phone);
    this.apintmentResults = [];
    let userAgent = this.userAgent();
    this.apointmentBySinglePhone(phones,userAgent, callback);

  }


  /**
   * apointmentBySinglePhone - 单个用户预约
   *
   * 1、登录
   * 2、获取默认地址
   * 3、预订
   *
   * @param  {type} phone description
   * @return {type}       description
   */
  apointmentBySinglePhone(phones,userAgent, callback) {
    let phone = phones.shift();

    if(!phone){
      console.log("所有手机号预约结束");
      return callback(this.apintmentResults);
    }
    phone = phone.trim();
    console.log('开始预约:', phone);
    this.login(phone, '123456', userAgent)
      .then(userinfo => {
        return this.getAddressId(phone)
      })
      .then(addressID => {
        return this.apointment(addressID, userAgent)
      })
      .then(apointmentRet => {
        let obj = {};
        obj[phone] = apointmentRet;
        this.apintmentResults.push(obj);
        console.log('预约结果',phone, apointmentRet);
        setTimeout(() => {
          this.apointmentBySinglePhone(phones, userAgent, callback);
        },3000)

      })
      .catch(e => {
        console.log('error', e);
        setTimeout(() => {
          this.apointmentBySinglePhone(phones, userAgent,callback);
        },3000)
      })
  }
}

module.exports = new MaotaiService();
