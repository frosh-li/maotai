var request = require("request");
const proxy = require('../controllers/proxy');
var Filecookietore = require('tough-cookie-filestore');
const fs = require('fs');
const sendmsg = require('../sendmsg');
var redis = require('redis');
var redisClient = redis.createClient();
const Utils = require('../services/utils');
redisClient.on('error', (error) => {
  // console.log(error);
})

const mysql = require('mysql');

var conn = mysql.createConnection(
  {
        host:"127.0.0.1",
        user:"db_bms_english4",
        password:"bmsroot",
        database: "db_bms_english4",
        multipleStatements:true,
        dateStrings:true
      }
);
const path = require('path');
var j = '';
request = request.defaults({
    jar: true,
    // proxy: 'http://'+proxy.proxyUser+':'+proxy.proxyPass+'@'+proxy.proxyHost+':'+proxy.proxyPort,
})
var AliVerify = require('./startAliVerify');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const colors = require('colors/safe');
var logger = require('../controllers/logger');

const DELAY = 1000;

function onJSONPCallback(data) {
  return data;
}

class MaotaiService {
    initCookiePath(path){
      j = request.jar(new Filecookietore('./cookies/'+path+'.json'));
    }
    getCurrentJar(tel) {
      return new Promise((resolve, reject) => {
        let path = './cookies/'+tel+'.json';
        var v = new Filecookietore(path);
        v.findCookies('www.cmaotai.com','/', function(err, cookie){
          if(err){
            console.log('cookie error');
            return reject(err);
          }
          return resolve(cookie.join(";"))
        })
      })

    }
    headers (userAgent, cookies='') {
      return {
        // // "proxy-authorization" : "Basic " + proxy.proxyAuth,
        'cache-control': 'no-cache',
        'cookie': cookies,
        'accept-language': 'zh-CN,en-US;q=0.8',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'application/x-www-form-urlencoded',
        'referer': 'https://www.cmaotai.com/ysh5/page/LoginRegistr/userLogin.html',
        'user-agent': userAgent,
        'x-requested-with': 'XMLHttpRequest',
        'Cache-Control': 'no-cache'
      }
    }
    get signSecrit() {
        return "my secrit";
    }
    md5(str) {
        let _md5 = crypto.createHash('md5');
        let result = _md5.update(str).digest('hex');
        return result.toLowerCase();
    }

    userAgent(mobile) {
        let os = "android";
        let version = "1.0.23";
        let appIndent = this.md5(mobile + this.signSecrit);
        let signString = "7c60b232d79d34d727c12c6f33ad8fea29ebb333ae0c1b3822e5a18934c8f189";
        let appIndentSign = this.md5([os, version, appIndent, signString].join("-"));
        return `Mozilla/5.0 (Linux; Android 4.4.4; LA2-SN Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[${os}/${version}/${appIndent}/${appIndentSign}]`;
    }

    netCode() {
      let url = 'https://diablo.alibaba.com/captcha/click/get.jsonp?sessionid=0152JIZgtMjy7iQLwB8JakWYmbCT-DhqmSbIM_uEaNpCsy4q5IvbDmkkTTuBye7elp5UiC6AxH1jxgsfVMPmsSTCPgmTM7LReHLecaxLu9dd4VzCnE8AM8wEwCH2x536UL5AuSV_hmv2nXACvU3uX_Dw&identity=FFFF00000000016A8646&style=ncc&lang=cn&v=918&';
      let options = {
            method: 'get',
            url: url,
            json:true
        };
      return new Promise((resolve, reject) => {
            request(options, function(error, response, body) {
                if (error) {
                    return reject(error);
                }
                let output = eval(body)
                return resolve(output)
            });
        })
    }
        /**
         * login - 登录
         *
         * @param  {type} tel  description
         * @param  {type} pass description
         * @return {type}      description
         */
    login(tel, pass = '123456', userAgent) {
        userAgent = userAgent || this.userAgent(tel);
        let now = +new Date();
        if (tel == "15330066919") {
            pass = "110520";
        }
        fs.writeFileSync('./cookies/'+tel+'.json', "");
        j = request.jar(new Filecookietore('./cookies/'+tel+'.json'));
        let options = {
            method: 'POST',
            url: 'https://www.cmaotai.com/API/Servers.ashx',
            headers: this.headers(userAgent),
            form: {
                action: 'UserManager.login',
                tel: tel,
                pwd: pass,
                timestamp121: now
            },
            json:true,
            jar:j
        };

        return new Promise((resolve, reject) => {
            request(options, function(error, response, body) {
                if (error) {
                    return reject(error);
                }
                if (body.state === true && body.code === 0) {
                    return resolve(body);
                } else {
                    return reject(new Error('登录失败:'+tel+':'+pass+':'+body.msg));
                }
            });
        })
    }

    editAddress(addressId, provinceId,cityId, districtsId, addressInfo, address, shipTo, callPhone, zipcode="000000",isDef=1,lng, lat, userAgent, j){
      console.log('arguments', arguments);
      let now = (+new Date());
      let options = {
          method: 'POST',
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent, j),
          form: {
              action: 'AddressManager.edit',
              sid: addressId,
              provinceId: provinceId,
              cityId: cityId,
              districtsId:districtsId,
              addressInfo:addressInfo,
              address: address,
              shipTo:shipTo,
              callPhone: callPhone,
              zipcode:zipcode,
              isDef: isDef,
              lng:lng,
              lat: lat,
              timestamp121: now
          },
          json:true,
          jar:true
      };
      console.log('options', options.form);
      return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            return resolve(body);
        });
      })
    }

    addAddress(provinceId,cityId, districtsId, addressInfo, address, shipTo, callPhone, zipcode="100000",isDef=1,lng, lat, userAgent,j){
      let now = (+new Date());
      let options = {
          method: 'POST',
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent,j),
          form: {
              action: 'AddressManager.add',
              provinceId: provinceId,
              cityId: cityId,
              districtsId:districtsId,
              addressInfo:addressInfo,
              address: address,
              shipTo:shipTo,
              callPhone: callPhone,
              zipcode:'000000',
              isDef: isDef,
              lng:lng,
              lat: lat,
              timestamp121: now
          },
          jar:j
      };
      return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            logger.info(body);
            body = JSON.parse(body);
            return resolve(body);
        });
      })
    }

    deleteAddress(addressId, userAgent,j) {
        let now = (+new Date());
        let options = {
            method: 'POST',
            url: 'https://www.cmaotai.com/API/Servers.ashx',
            headers: this.headers(userAgent),
            form: {
                action: 'AddressManager.delete',
                Sid: addressId,
                timestamp121: now
            },
            jar:j
        };
        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              logger.info(body);
              body = JSON.parse(body);
              if (body.state === true && body.code === 0) {
                  return resolve(body);
              } else {
                  return reject(new Error(body.msg));
              }
          });
        })
    }


    /**
     * checkAliToken - 动态检查是否获取到最新的阿里验证码
     *
     * @param  {type} callback description
     * @return {type}          description
     */
    checkAliToken(callback) {
        let aliSessionId = fs.readFileSync(path.resolve(__dirname,'../aliSessionId.txt')).toString('utf8');
        if (!aliSessionId) {
            setTimeout(() => {
                this.checkAliToken(callback);
            }, 100);
        } else {
            logger.info('token成功获取到', aliSessionId);
            callback(aliSessionId);
        }
    }


    /**
     * LBSServer -
     * 根据定位获取茅台推送的酒品网点
     * 无推送结果不能发送订单
     * 获取推送结果判定是否购买
     * 锁定网点逻辑也在这里面
     *
     * @param  {type} addressID description
     * @param  {type} tel       description
     * @param  {type} userAgent description
     * @param  {type} pid = 391 description
     * @return {type}           description
     */
    LBSServer(addressID, tel, userAgent, pid = 391, j) {
        let now = (+new Date());
        let that = this;
        return new Promise((resolve, reject) => {
            let options = {
                method: 'get',
                url:"https://www.baidu.com",
                //url: 'https://www.cmaotai.com/API/LBSServer.ashx',
                headers: {
                    // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                    'cookie':j,
                    'cache-control': 'no-cache',
                    'accept-language': 'zh-CN,en-US;q=0.8',
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'content-type': 'application/x-www-form-urlencoded',
                    'referer': `https://www.cmaotai.com/ysh5/page/Category/productDetails.html?productId=${pid}`,
                    'user-agent': userAgent,
                    'x-requested-with': 'XMLHttpRequest'
                },
                form: {
                    pid: pid,
                    quant: 6,
                    timestamp121: now
                },
                json:true
            };
            request(options, function(error, response, body) {
                if (error) {
                  logger.info("定位信息获取错误", error);
                  return reject(error);
                };
                if(body.code === 9999){
                }
                return resolve({
                  addressID: addressID,
                  lbsdata: body
                });
            });
        })
    }

    getToken() {
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
            return resolve({key:reply,token:token});
          })
        })
      })
    }

    fixShop(network, shopName) {
      let result = false;
      let allShopNames = shopName.split("|");
      logger.info(allShopNames);
      logger.info(network);
      allShopNames.forEach(item=>{
        if(
            network.SName.indexOf(item) > -1
            ||
            network.DName.indexOf(item) > -1
            ||
            network.Address.indexOf(item) > -1
        ){
          result = true;
        }
      })
      return result;
    }
    /**
     * createOrder - 创建订单
     * fixedShopName:
     * 雍贵中心网店ID 211110105003
     * 不限制为-1
     * @param  {type} tel        手机号
     * @param  {type} pid        商品编号 茅台飞天53°的ID为391
     * @param  {type} quantity=6 购买数量 6瓶为一箱，优先购买一箱
     * @param  {userAgent} userAgent 固定分配的登录手机号
     * @param  {string} fixedShopName 是否锁定购买某一家 -1为不锁定  211110102007雍贵中心 211110105003双龙
     * @return {type}            description
     */

    createOrder(stel, pid, quantity = 6, userAgent, scopeAddress, shopId, fixedShopName = -1, j) {
        logger.info('create order params', arguments);
        if (typeof stel === 'string') {
            var tel = stel;
            var pass = '123456';
        } else {
            var tel = stel.phone;
            var pass = stel.pass;
        }

        userAgent = userAgent || this.userAgent(tel);
        let shopName = fixedShopName;
        let now = +new Date();
        return new Promise((resolve, reject) => {
            this.getToken()
              .then(aliSessionId => {
                  let that = this;
                  let options = {
                      method: 'POST',
                      url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
                      headers: {
                          'cookie':j,
                          // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                          'cache-control': 'no-cache',
                          'accept-language': 'zh-CN,en-US;q=0.8',
                          accept: 'application/json, text/javascript, */*; q=0.01',
                          'content-type': 'application/x-www-form-urlencoded',
                          referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                          'user-agent': userAgent,
                          'x-requested-with': 'XMLHttpRequest'
                      },
                      form: {
                        action: "MemberManager.coupon",
                        sid: shopId,
                        pid: pid,
                        count: quantity,
                        timestamp121: (+new Date())
                      },

                      json:true
                  };
                  request(options, function(error, response, body) {
                      if (error) {
                          return reject(error);
                      };
                      logger.info('coupon info', body);
                      let couponsId = body.data.Cid;
                      // let couponsId = 'b1b99dd3e5664458afa839e3e7c52724'
                      // 如果找到对应shopID

                      let options = {
                          method: 'POST',
                          url: 'https://www.cmaotai.com/API/CreateOrder.ashx',
                          headers: {
                              // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                              'cache-control': 'no-cache',
                              'accept-language': 'zh-CN,en-US;q=0.8',
                              accept: 'application/json, text/javascript, */*; q=0.01',
                              'content-type': 'application/x-www-form-urlencoded',
                              referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                              'user-agent': userAgent,
                              'x-requested-with': 'XMLHttpRequest',
                              'cookie':j,
                          },

                          form: {
                              productId: pid,
                              quantity: quantity,
                              couponsId: couponsId,
                              addressId: scopeAddress,
                              invioceId: -1,
                              express: 14,
                              shopId: shopId,
                              sessid: aliSessionId.token,
                              remark: '',
                              timestamp121: (+new Date())
                          }
                      };
                      // productId 391
                      // quantity  6
                      // couponsId 5bdf091be6ab4837a0ecf6d624c41f26
                      // addressId 1924110
                      // invioceId -1
                      // express 14
                      // shopId  161610100018
                      // sessid  nc1-01W8fUo7tiNBKrkhR8ACXXKa7iBBDH1y3J0CDrEthFzlTNpsPjtpYek3o3FHpHt3fZ-nc2-0561M3bob-R8gv1KNXk15v5Zpzwr5-aA0d72EwzdOiQ4yF_oZXhNR3wj9Ui770CX4eKbPK7vEuAXN6pqFY62tiCddhKDzzaVVBi1QL1KGNBX47HA687xzvBLbSMxProRMf6YwLBXaxmIci5uutEeL13GykCvJb4lfdA4B5mO7sXuxrBIslSrNkdZL0myaCGppz51RYEogBMwUazCe0Gmu_4rZ-u5smNUCcFL4ya7FiHf5iekkXdiY3Q2fNkKGdQPu77n45tVC52LG_H0SCfbLMqtoU1tmCuQ7gQ1UZzDp9ONxSGYQ8dIgJJjigUtXuBLOTSPXdQOdFkqIs6JjFsXAkp1sAxQHojeOF39MSL4bxBD6ECAAYd4722G4Y2yIX3dXl7S9KEx_7rE6J4_Qe-tKZvj0s5vNYP0vJP7P4Wv4Z6jM-nc3-01TzB8fzgmvi9w1w4Zzf-Aou5wAmuHVmzkWmgqL_rJEAfWDAe5-mM9bYVdvGJY2qVCFybtUWb9qd-2xX8YIpqSIDLmQJpgazyeLOv1rOhNl5mqdxjkB3iFVFv0N8IigAoPdXEJxKKKUu7F2-cvvWc-lg-nc4-FFFFA0000000016A858A
                      // remark
                      // timestamp121  1522290257472
                      // aliSessionId = null;
                      // fs.writeFileSync("../aliSessionId.txt", "");
                        logger.info(options.form);
                        aliSessionId.key && redisClient.del(aliSessionId.key, (err) => {
                          if(err){
                            logger.error(err);
                          }
                        });
                        request(options, function(error, response, body) {
                            if (error) {
                                return reject(error);
                            };
                            logger.info(colors.green('下单完成'+JSON.stringify(body)));
                            return resolve(JSON.parse(body));
                        });

                  })

              }).catch(e => {
                  logger.info(e);
                  return reject(e);
              })
        })
    }

    /**
     * createOrder - 创建订单
     * fixedShopName:
     * 雍贵中心网店ID 211110105003
     * 不限制为-1
     * @param  {type} tel        手机号
     * @param  {type} pid        商品编号 茅台飞天53°的ID为391
     * @param  {type} quantity=6 购买数量 6瓶为一箱，优先购买一箱
     * @param  {userAgent} userAgent 固定分配的登录手机号
     * @param  {string} fixedShopName 是否锁定购买某一家 -1为不锁定  211110102007雍贵中心 211110105003双龙
     * @return {type}            description
     */
     //(tel, pid , 6, userAgent, scopeAddress, fixedShopId, currentJar)
    createOrderByScan(stel, pid, quantity,StockCount, userAgent, scopeAddress, shopId, fixedShopName = -1, j) {
        var tel = stel.phone;
        var pass = stel.pass;
        logger.info('create order:', tel, pass, shopId);
        userAgent = userAgent || this.userAgent(tel);
        let shopName = fixedShopName;
        let now = +new Date();
        return new Promise((resolve, reject) => {
          let that = this;
          let optionscoupon = {
              method: 'POST',
              url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
              headers: {
                  'cookie':j,
                  // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                  'cache-control': 'no-cache',
                  'accept-language': 'zh-CN,en-US;q=0.8',
                  accept: 'application/json, text/javascript, */*; q=0.01',
                  'content-type': 'application/x-www-form-urlencoded',
                  referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                  'user-agent': userAgent,
                  'x-requested-with': 'XMLHttpRequest'
              },
              form: {
                action: "MemberManager.coupon",
                sid: shopId,
                pid: pid,
                count: quantity,
                timestamp121: (+new Date())
              },

              json:true
          };
          request(optionscoupon, function(error, response, body) {
              if (error) {
                  return reject(error);
              };
              let couponsId = body.data.Cid;
              // 如果找到对应shopID
              let options = {
                  method: 'POST',
                  url: 'https://www.cmaotai.com/API/CreateOrder.ashx',
                  headers: {
                      // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                      'cache-control': 'no-cache',
                      'accept-language': 'zh-CN,en-US;q=0.8',
                      accept: 'application/json, text/javascript, */*; q=0.01',
                      'content-type': 'application/x-www-form-urlencoded',
                      referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                      'user-agent': userAgent,
                      'x-requested-with': 'XMLHttpRequest',
                      'cookie':j,
                  },

                  form: {
                      productId: pid,
                      quantity: quantity,
                      couponsId: couponsId,
                      addressId: scopeAddress,
                      invioceId: -1,
                      express: 14,
                      shopId: shopId,
                      sessid: '',
                      remark: '',
                      timestamp121: (+new Date())
                  },
                  json:true
              };
              // let _body = {status: true, code: 0};
              // // return resolve({
              // //   data:_body,
              // //   StockCount: StockCount,
              // //   buyLimit: quantity,
              // // });
              redisClient.randomkey((err, key) => {
                if(err){
                  return reject(err);
                }
                console.log('get key from redis', key);
                if(!key){
                  return reject(new Error("无法获取token"));
                }
                redisClient.get(key, (err, token) => {
                    options.form.sessid = token;
                    request(options, function(error, response, body) {
                        if (error) {
                            return reject(error);
                        };
                        try{
                          //conn.query(`insert into maotai_order(phone, pass, flagDate, number) values("${tel}", "${pass}", "${Utils.dateFormat()}", ${quantity})`, (err, res) => {
                           // if(err){
                              //console.log(err);
                            //}
                         // })
                        }catch(e){
                          //logger.error(e);
                        }
                        if(body && body.code !== undefined && body.code === 0){
                          return resolve({
                            data:body,
                            StockCount: StockCount,
                            buyLimit: quantity,
                          });
                          // sendmsg('15330066919', '订单提交成功'+tel+":"+pass+":"+shopId+":库存"+StockCount+":限购"+quantity)
                          //   .then(() => {
                          //     return resolve({
                          //       data:body,
                          //       StockCount: StockCount,
                          //       buyLimit: quantity,
                          //     });
                          //   })
                          //   .catch(e => {
                          //     return resolve({
                          //       data:body,
                          //       StockCount: StockCount,
                          //       buyLimit: quantity,
                          //     });

                          //   })
                        }else{
                            // 如果下单成功，但是并没有返回正常的编码
                            // 检查订单
                          return resolve({
                            data:body,
                            StockCount: StockCount,
                            buyLimit: quantity,
                          });
                        }
                        logger.info(colors.green('下单完成'+JSON.stringify(body)));
                    });
                    if(key)
                    {
                          redisClient.del(key);
                    }
                })

            })
          })
        })
    }


    /**
     * createOrderForCenter - 定点购买云商总部商品
     *
     * @param  {type} stel               description
     * @param  {type} pid                description
     * @param  {type} quantity           description
     * @param  {type} StockCount         description
     * @param  {type} userAgent          description
     * @param  {type} scopeAddress       description
     * @param  {type} shopId             description
     * @param  {type} fixedShopName = -1 description
     * @param  {type} j                  description
     * @return {type}                    description
     */
    createOrderForCenter(stel, pid, quantity=5,StockCount, userAgent, scopeAddress, shopId, fixedShopName = -1, j) {
        quantity=5;
        var tel = stel.phone;
        var pass = stel.pass;
        logger.info('create order:', tel, pass, shopId);
        userAgent = userAgent || this.userAgent(tel);
        let shopName = fixedShopName;
        let now = +new Date();
        return new Promise((resolve, reject) => {
          let that = this;
          let optionscoupon = {
              method: 'POST',
              url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
              headers: {
                  'cookie':j,
                  // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                  'cache-control': 'no-cache',
                  'accept-language': 'zh-CN,en-US;q=0.8',
                  accept: 'application/json, text/javascript, */*; q=0.01',
                  'content-type': 'application/x-www-form-urlencoded',
                  referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                  'user-agent': userAgent,
                  'x-requested-with': 'XMLHttpRequest'
              },
              form: {
                action: "MemberManager.coupon",
                sid: 152520100037,
                pid: pid,
                count: quantity,
                timestamp121: (+new Date())
              },
              json:true
          };
          request(optionscoupon, function(error, response, body) {
              if (error) {
                  return reject(error);
              };
              let couponsId = body.data.Cid;
              // 如果找到对应shopID
              let options = {
                  method: 'POST',
                  url: 'https://www.cmaotai.com/API/CreateOrder.ashx',
                  headers: {
                      // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                      'cache-control': 'no-cache',
                      'accept-language': 'zh-CN,en-US;q=0.8',
                      accept: 'application/json, text/javascript, */*; q=0.01',
                      'content-type': 'application/x-www-form-urlencoded',
                      referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                      'user-agent': userAgent,
                      'x-requested-with': 'XMLHttpRequest',
                      'cookie':j,
                  },

                  form: {
                      productId: pid,
                      quantity: quantity,
                      couponsId: couponsId,
                      addressId: scopeAddress,
                      invioceId: -1,
                      express: 14,
                      shopId: shopId,
                      sessid: '',
                      remark: '',
                      timestamp121: (+new Date())
                  },
                  json:true
              };

              redisClient.randomkey((err, key) => {
                if(err){
                  return reject(err);
                }
                console.log('get key from redis', key);
                if(!key){
                  return reject(new Error("无法获取token"));
                }
                redisClient.get(key, (err, token) => {
                    options.form.sessid = token;
                    request(options, function(error, response, body) {
                        if (error) {
                            return reject(error);
                        };
                        if(body && body.code !== undefined && body.code === 0){
                          sendmsg('15330066919', '订单提交成功'+tel+":"+pass+":"+shopId+":库存"+StockCount+":限购"+quantity);
                        }else{
                            // 如果下单成功，但是并没有返回正常的编码
                            // 检查订单
                        }
                        logger.info(colors.green('下单完成'+JSON.stringify(body)));
                        return resolve({
                          data:body,
                          StockCount: StockCount,
                          buyLimit: quantity,
                        });
                    });
                    if(key)
                    {
                          redisClient.del(key);
                    }
                })

            })
          })
        })
    }

    getAddressId(tel,j) {
        logger.info('start get addressID from mobile:', tel);
        let now = +new Date();
        let options = {
            method: 'POST',
            jar: true,
            url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
            headers: {
                // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                'cache-control': 'no-cache',
                'cookie':j,
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                action: 'AddressManager.list',
                index: '1',
                size: '10',
                timestamp121: now
            }
        };

        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              let bodyJSON = JSON.parse(body);
              logger.info(body);
              // logger.info(bodyJSON.data.list[0])
              if(bodyJSON.data && bodyJSON.data.list && bodyJSON.data.list.length > 0){
                //logger.info('获取的地址id', bodyJSON.data.list[0].SId);
                // logger.info('获取的地址id', bodyJSON.data.list[0]);
                let sid = bodyJSON.data.list[0].SId;
                bodyJSON.data.list.forEach(item => {
                  if(item.AddressInfo.indexOf('甘肃') > -1){
                    sid = item.SId;
                  }
                })
                return resolve(sid);
              }else{
                return resolve("");
              }


          });
        })
    }

    getAllAddress(tel, j) {
        logger.info('start get addressID from mobile:', tel);
        let now = +new Date();

        var options = {
            method: 'POST',
            url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
            headers: {
                // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                'cookie': j,
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            jar:true,
            form: {
                action: 'AddressManager.list',
                index: '1',
                size: '10',
                timestamp121: now
            }
        };

        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              // console.log(body)
              let bodyJSON = JSON.parse(body);
              if(bodyJSON && bodyJSON.data && bodyJSON.data.list){
                return resolve(bodyJSON.data.list);
              }else{
                return reject('错误')
              }

          });
        })
    }

    _getOrders(userId,userAgent, j) {

        let now = +new Date();
        console.log(j);
        var options = {
            method: 'POST',
            jar:true,
            url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
            headers: this.headers(userAgent,j),
            form: {
                action: 'OrdersManager.GetUserOrderInfo',
                userId: userId,
                index: '1',
                size: '10',
                timestamp121: now
            },
            json:true
        };

        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              console.log('order', body);
              if(body.data && body.data.Data)
                return resolve(body.data.Data);
              else
                return resolve([]);
          });
        })
    }

    getOrder(user, j){
      let userAgent = this.userAgent(user.phone);
      return new Promise((resolve, reject) => {
        this.userinfo(user, j)
          .then(userid => {
            return this._getOrders(userid,userAgent, j);
          })
          .then(data => {
            return resolve(data);
          })
          .catch(e => {
            return reject(e);
          })
      })
    }

    userinfo(user, j){
      let userAgent = this.userAgent(user.phone);
      let now = +new Date();

      var options = {
          method: 'POST',
          jar:true,
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent, j),
          form: {
              action:'UserManager.info',
              index:1,
              size:10,
              timestamp121: now
          },
          json:true
      };
      return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  logger.info(error);
                  return reject(error);
              } else {
                console.log(body)
                if(body.code == 0){
                  return resolve(body.data.userId);
                }else{
                  return reject(new Error('获取不到账号信息'));
                }
              }
          });
      })
    }

    apointStatus(userAgent, j) {
      // state_1: "审核中",
      // state_2: "预约失败",
      // state_3: "预约成功",
      // state_4: "已使用",
      // state_5: "申诉中",
      // state_6: "已失效"
      let now = +new Date();

      var options = {
          method: 'POST',
          jar:true,
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent, j),
          form: {
              action:'ReservationsManager.List',
              index:1,
              size:10,
              timestamp121: now
          },
          json:true
      };

      return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  logger.info(error);
                  return reject(error);
              } else {
                if(body && body.data && body.data.datas && body.data.datas.length > 0){
                  let ret = body.data.datas[0];
                  return resolve(ret);
                }else{
                  console.log(body);
                  return resolve({});
                }
              }
          });
      })
    }

    /**
     * apointment - 预约
     *
     * @param  {type} addressID description
     * @param  {type} pid=391   description
     * @return {type}           description
     */
    apointment(addressID, userAgent, pid = 391,j ) {
        let now = +new Date();
        var options = {
            method: 'POST',
            jar:true,
            url: 'https://www.cmaotai.com/API/Servers.ashx',
            headers: this.headers(userAgent, j),
            form: {
                action: 'ReservationsManager.Regist',
                addressID: addressID,
                pid: pid,
                timestamp121: now
            }
        };

        return new Promise((resolve, reject) => {
            request(options, function(error, response, body) {
                if (error) {
                    logger.info(error);
                    return reject(error);
                } else {
                    logger.info("预约结果", body);
                    let ret = JSON.stringify(body);
                    if (body.state === false) {
                        return reject("预约失败:" + body.msg);
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
        this.apintmentResults = [];
        this.apointSuccess = [];
        this.apointFail = []
        this.apointmentBySinglePhone(phones, null, callback);
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
    apointmentBySinglePhone(phones, userAgent, callback) {
        let sphone = phones.shift();
        if (!sphone) {
            logger.info("所有手机号预约结束");
            logger.info("预约成功:")
            logger.info(JSON.stringify(this.apointSuccess));
            fs.writeFileSync('./apointSuccess.json', JSON.stringify(this.apointSuccess));
            logger.info("预约失败:")
            logger.info(JSON.stringify(this.apointFail));
            fs.writeFileSync('./apointFail.json', JSON.stringify(this.apointFail));
            return callback(this.apintmentResults);
        }
        var phone = sphone.phone.trim();
        var pass = sphone.pass.trim();

        userAgent = this.userAgent(phone);
        let currentJar = null;
        logger.info('开始预约:', phone);
        this.getCurrentJar(phone)
            .then(currentJar => {
                return this.apointment(sphone.addressId, userAgent, 391, currentJar)
            })
            .then(apointmentRet => {
                logger.info('预约结果', phone, apointmentRet);
                let ret = JSON.parse(apointmentRet);
                if(ret.state === true && ret.code === 0){
                  this.apointSuccess.push({
                    phone: phone,
                    pass: pass,
                    addressId: sphone.addressId
                  })
                }else{
                  this.apointFail.push({
                    phone: phone,
                    pass: pass,
                    addressId: sphone.addressId
                  })
                }
                setTimeout(() => {
                    this.apointmentBySinglePhone(phones, userAgent, callback);
                }, 1000)
            })
            .catch(e => {
              logger.info('error', e);
              this.apointFail.push({
                phone: phone,
                pass: pass,
                addressId: sphone.addressId
              })
              setTimeout(() => {
                  this.apointmentBySinglePhone(phones, userAgent, callback);
              }, 1000)
            })

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
    _apointmentBySinglePhone(phone, callback, j) {
        phone = phone.trim();
        let userAgent = this.userAgent(phone);
        logger.info('开始预约:', phone);


        return this.LBSServer(addressID, phone, userAgent,391, j)
          .then(data => {
            let addressID = data.addressID
            return this.apointment(addressID, userAgent, j)
          })
          .then(apointmentRet => {
            logger.info('预约结果', phone, apointmentRet);
            callback(apointmentRet)
          })
          .catch(e => {
            logger.info('error', e);
            callback(e)
          })
    }

    /**
     * 登记请求发送
     *  action	GrabSingleManager.grabSingleLogin
     *  pid	389
     *  timestamp121	1523844584918
     *
     *

        获取登记列表
        action	GrabSingleManager.getList
        index	1
        size	10
        timestamp121	1523845500386

        {
          	"state": true,
          	"code": 0,
          	"data": "{\"retcode\":500,\"retmsg\":\"fail\",\"count\":0,\"data\":{\"totel\":0,\"data\":null,\"oii\":null}}"
          }
     */
     GrabLogin(account, addressId, j) {
       let now = +new Date();
       let userAgent = this.userAgent(account.phone)
       var options = {
           method: 'POST',
           jar:true,
           url: 'https://www.cmaotai.com/API/Servers.ashx',
           headers: {
             'cookie':j,
             // "proxy-authorization" : "Basic " + proxy.proxyAuth,
             'cache-control': 'no-cache',
             'accept-language': 'zh-CN,en-US;q=0.8',
             'accept': 'application/json, text/javascript, */*; q=0.01',
             'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
             'Connection': 'keep-alive',
             'referer': `https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleProductDetails.html?pid=391`,
             'user-agent': userAgent,
             'x-requested-with': 'XMLHttpRequest'
           },
           form: {
             pid:391,
             action:	'GrabSingleManager.grabSingleLogin',
             timestamp121:	now
           },
           json:true,
           timeout:5000,
       };
       logger.info('登记登陆',account.phone,addressId);
       return new Promise((resolve, reject) => {
           request(options, function(error, response, body) {
               if (error) {
                   logger.info(error);
                   return reject(error);
               } else {
                   logger.info("登记登陆DONE",account.phone, body);
                   let ret = JSON.stringify(body);
                   // if (body.state === false) {
                   //     return reject("登记登陆Fail:" + body.msg);
                   // }
                   request({
                       method: 'POST',
                       jar:true,
                       url: 'https://www.cmaotai.com/API/Servers.ashx',
                       headers: {
                         'cookie':j,
                         // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                         'cache-control': 'no-cache',
                         'accept-language': 'zh-CN,en-US;q=0.8',
                         'accept': 'application/json, text/javascript, */*; q=0.01',
                         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                         'Connection': 'keep-alive',
                         'referer': `https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleProductDetails.html?pid=628`,
                         'user-agent': userAgent,
                         'x-requested-with': 'XMLHttpRequest'
                       },
                       form: {
                         pid:628,
                         action:  'GrabSingleManager.grabSingleLogin',
                         timestamp121:  now
                       },
                       json:true,
                       timeout:5000,
                   }, (error, response, body)=>{
                      if(error){
                        logger.info(error);
                        return reject(error);
                      }
                      if (body.state === false) {
                          return reject("登记登陆Fail:" + body.msg);
                      }
                      return resolve(body);
                   })
               }
           });
       })
     }

     GrabDefaultAdd(account, addressId, j) {
       let now = +new Date();
       let userAgent = this.userAgent(account.phone)
       var options = {
           method: 'POST',
           jar:true,
           url: 'https://www.cmaotai.com/API/Servers.ashx',
           headers: {
             'cookie':j,
             // "proxy-authorization" : "Basic " + proxy.proxyAuth,
             'cache-control': 'no-cache',
             'accept-language': 'zh-CN,en-US;q=0.8',
             'accept': 'application/json, text/javascript, */*; q=0.01',
             'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
             'Connection': 'keep-alive',
             'referer': `https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html?qty=1`,
             'user-agent': userAgent,
             'x-requested-with': 'XMLHttpRequest'
           },
           form: {
             action:	'GrabSingleManager.getDefualtAdd',
             timestamp121:	now
           },
           json:true,
           timeout:5000,
       };
       logger.info('获取默认地址',account.phone,addressId);
       return new Promise((resolve, reject) => {
           request(options, function(error, response, body) {
               if (error) {
                   logger.info(error);
                   return reject(error);
               } else {
                   // logger.info("获取默认地址",account.phone, body);
                   let ret = JSON.stringify(body);
                   if (body.state === false) {
                       return reject("登记登陆Fail:" + body.msg);
                   }
                   return resolve(body);
               }
           });
       })
    }


    getProductInfo(account, addressId, j) {
      let now = +new Date();
      let userAgent = this.userAgent(account.phone)
      var options = {
          method: 'POST',
          jar:true,
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: {
            'cookie':j,
            // "proxy-authorization" : "Basic " + proxy.proxyAuth,
            'cache-control': 'no-cache',
            'accept-language': 'zh-CN,en-US;q=0.8',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Connection': 'keep-alive',
            'referer': `https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html?qty=1`,
            'user-agent': userAgent,
            'x-requested-with': 'XMLHttpRequest'
          },
          form: {
            action:	'ProductManager.Product',
            timestamp121:	now,
            pid: 391
          },
          json:true,
          timeout:5000,
      };
      logger.info('获取一次商品信息',account.phone,addressId);
      return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  logger.info(error);
                  return reject(error);
              } else {
                  let ret = JSON.stringify(body);
                  if (body.state === false) {
                      return reject("获取一次商品信息:" + body.msg);
                  }
                  return resolve(body);
              }
          });
      })
    }

    grabStatus(account , j){
      let now = +new Date();
      let userAgent = this.userAgent(account.phone)

      var options = {
          method: 'POST',
          jar:true,
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: {
            'cookie':j,
            // "proxy-authorization" : "Basic " + proxy.proxyAuth,
            'cache-control': 'no-cache',
            'accept-language': 'zh-CN,en-US;q=0.8',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Connection': 'keep-alive',
            'referer': `https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html`,
            'user-agent': userAgent,
            'x-requested-with': 'XMLHttpRequest'
          },
          form: {
            timestamp121:	now,
            action: 'GrabSingleManager.getList',
            index: 1,
            status: -1,
            size: 10

          },
          json:true,
          timeout:5000,
      };
      // console.log(options.form);
      logger.info('获取订单状态',account.phone);
      return new Promise((resolve, reject) => {

          request(options, function(error, response, body) {
              if (error) {
                  logger.info(error);
                  return reject(error);
              } else {
                  if (body.state === false) {
                      return reject("没有订单:" + body.msg);
                  }
                  if(body.data && JSON.parse(body.data).data){
                    return resolve(JSON.parse(body.data).data.data || []);
                  }else{
                    return resolve([]);
                  }

              }
          });


      })
    }
    GrabSubmit(account, addressId,orderCount, j) {
      let now = +new Date();
      let userAgent = this.userAgent(account.phone)

      var options = {
          method: 'POST',
          jar:true,
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: {
            'cookie':j,
            // "proxy-authorization" : "Basic " + proxy.proxyAuth,
            'cache-control': 'no-cache',
            'accept-language': 'zh-CN,en-US;q=0.8',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Connection': 'keep-alive',
            'referer': `https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html`,
            'user-agent': userAgent,
            'x-requested-with': 'XMLHttpRequest'
          },
          form: {
            sid:	addressId,
            iid:	-1,
            qty:	2,
            express:	14,
            product:	'{"Pid":391,"PName":"贵州茅台酒 (新飞天) 53%vol 500ml","PCode":"23","Unit":"瓶","CoverImage":"/upload/fileStore/20180415/6365942315164224808933821.jpg","SalePrice":1499}',
            remark: ''	,
            action:	'GrabSingleManager.submit',
            timestamp121:	now
          },
          json:true,
          timeout:5000,
      };
      // console.log(options.form);
      logger.info('开始下单',account.phone,addressId);
      return new Promise((resolve, reject) => {

          request(options, function(error, response, body) {
              if (error) {
                  logger.info(error);
                  return reject(error);
              } else {
                  logger.info("提交订单完成",account.phone, body);
                  let ret = JSON.stringify(body);
                  request({
                      method: 'POST',
                      jar:true,
                      url: 'https://www.cmaotai.com/API/Servers.ashx',
                      headers: {
                        'cookie':j,
                        // "proxy-authorization" : "Basic " + proxy.proxyAuth,
                        'cache-control': 'no-cache',
                        'accept-language': 'zh-CN,en-US;q=0.8',
                        'accept': 'application/json, text/javascript, */*; q=0.01',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Connection': 'keep-alive',
                        'referer': `https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html`,
                        'user-agent': userAgent,
                        'x-requested-with': 'XMLHttpRequest'
                      },
                      form: {
                        sid:  addressId,
                        iid:  -1,
                        qty:  1,
                        express:  14,
                        product:  '{"Pid":628,"PName":"贵州茅台酒（戊戌狗年）53%vol 500ml","PCode":"2021","Unit":"瓶","CoverImage":"/upload/fileStore/20180415/6365942397923095142663827.jpg","SalePrice":1699}',
                        remark: ''  ,
                        action: 'GrabSingleManager.submit',
                        timestamp121: now
                      },
                      json:true,
                      timeout:5000,
                  }, (error, response, body) => {
                    if(error){
                      logger.info(error);
                      return reject(error);
                    }
                    if (body.state === false) {
                        return reject("提交订单失败:" + body.msg);
                    }
                    return resolve(body);
                  })

              }
          });


      })
    }
    /**
     * bindNetwork - 绑定账号和网点关系
     *
     * @param  {type} sid    description
     * @param  {type} shopId description
     * @param  {type} j      description
     * @return {type}        description
     */
    bindNetwork(phone, sid, j){
      let now = +new Date();
      let userAgent = this.userAgent()
      var options = {
          method: 'POST',
          jar:true,
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent, j),
          form: {
              action: 'SalesManager.bandingShop',
              sid: sid,
              timestamp121: now
          }
      };

      return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  logger.info(error);
                  return reject(error);
              } else {
                  logger.info("绑定网点结果", body);
                  let ret = JSON.stringify(body);
                  if (body.state === false) {
                      return reject("绑定网点失败:" + body.msg);
                  }
                  return resolve(body);
              }
          });
      })
    }

}

module.exports = new MaotaiService();
