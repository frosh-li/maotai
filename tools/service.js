var request = require("request");
var FileCookieStore = require('tough-cookie-filestore');
var j = request.jar(new FileCookieStore('cookies.json'));
request = request.defaults({
    jar: true
})
var AliVerify = require('./startAliVerify');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const colors = require('colors/safe');

const DELAY = 1000;

class MaotaiService {
    headers (userAgent) {
      return {
        'cache-control': 'no-cache',
        'accept-language': 'zh-CN,en-US;q=0.8',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'application/x-www-form-urlencoded',
        'referer': 'https://www.cmaotai.com/ysh5/page/LoginRegistr/userLogin.html',
        'user-agent': userAgent,
        'x-requested-with': 'XMLHttpRequest'
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
        j = request.jar();
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
            jar: j
        };

        return new Promise((resolve, reject) => {
            request(options, function(error, response, body) {
                if (error) {
                    return reject(error);
                }
                body = JSON.parse(body);
                if (body.state === true && body.code === 0) {
                    return resolve(body);
                } else {
                    return reject(new Error(tel+':'+pass+':'+body.msg));
                }
            });
        })
    }

    editAddress(addressId, provinceId,cityId, districtsId, addressInfo, address, shipTo, callPhone, zipcode="550000",isDef=1,lng, lat, userAgent){
      let now = (+new Date());
      let options = {
          method: 'POST',
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent),
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
              zipcode:'000000',
              isDef: isDef,
              lng:lng,
              lat: lat,
              timestamp121: now
          },
          jar: j
      };
      return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            console.log(body);
            body = JSON.parse(body);
            if (body.state === true && body.code === 0) {
                return resolve(body);
            } else {
                return reject(new Error(body.msg));
            }
        });
      })
    }

    addAddress(provinceId,cityId, districtsId, addressInfo, address, shipTo, callPhone, zipcode="100000",isDef=1,lng, lat, userAgent){
      let now = (+new Date());
      let options = {
          method: 'POST',
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent),
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
          jar: j
      };
      return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            console.log(body);
            body = JSON.parse(body);
            if (body.state === true && body.code === 0) {
                return resolve(body);
            } else {
                return reject(new Error(body.msg));
            }
        });
      })
    }

    deleteAddress(addressId, userAgent) {
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
            jar: j
        };
        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              console.log(body);
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
        if (!aliSessionId) {
            setTimeout(() => {
                this.checkAliToken(callback);
            }, 100);
        } else {
            console.log('token成功获取到', aliSessionId);
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
    LBSServer(addressID, tel, userAgent, pid = 391) {
        let now = (+new Date());
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: 'https://www.cmaotai.com/API/LBSServer.ashx',
                headers: {
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
                jar: j,
                json:true
            };
            request(options, function(error, response, body) {
                if (error) {
                    return reject(error);
                };
                console.log('定位查询结果', body);
                return resolve({
                    addressID: addressID,
                    lbsdata: body
                });
            });
        })
    }

    fixShop(network, shopName) {
      let result = false;
      let allShopNames = shopName.split("|");
      console.log(allShopNames);
      allShopNames.forEach(item=>{
        if(network.SName.indexOf(item) > -1 || network.DName.indexOf(item) > -1){
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
    createOrder(stel, pid, quantity = 6, userAgent, fixedShopName = -1) {
        if (typeof stel === 'string') {
            var tel = stel;
            var pass = '123456';
        } else {
            var tel = stel.phone;
            var pass = stel.pass;
        }
        let shopId = -1;
        userAgent = userAgent || this.userAgent(tel);
        let shopName = fixedShopName;
        let now = +new Date();
        let scopeAddress = null;
        console.log('useragent createorder', userAgent);
        return new Promise((resolve, reject) => {
            this.login(tel, pass, userAgent)
                .then(data => {
                    return this.getAddressId(tel)
                })
                .then(address => {
                    scopeAddress = address;
                    return this.LBSServer(address, tel, userAgent);
                })
                .then(data => {

                    if (data && data.lbsdata && data.lbsdata.data && data.lbsdata.data.stock && data.lbsdata.data.stock) {
                      if(
                        data.lbsdata.data.stock.StockCount > 0
                        &&
                        data.lbsdata.data.limit.LimitCount >= quantity
                        &&
                        this.fixShop(data.lbsdata.data.network, shopName)
                      ){
                        shopId = data.lbsdata.data.network.Sid;
                        return AliVerify.connectSidFromHard();
                      }else {
                        return reject(new Error("该网点无库存或可购买数量不够"));
                      }

                    } else {
                        return reject(new Error("订单错误，因为商家没有上货"));
                    }
                }).then(data => {
                    if (data === true) {
                        this.checkAliToken((aliSessionId) => {
                          let options = {
                              method: 'POST',
                              url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
                              headers: {
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
                                count: quantity
                              },
                              json:true,
                              jar: j
                          };
                          request(options, function(error, response, body) {
                              if (error) {
                                  return reject(error);
                              };

                              console.log(colors.green('获取优惠券'+JSON.stringify(body)));
                              let couponsId = body.data.Cid;
                              // 如果找到对应shopID
                              let options = {
                                  method: 'POST',
                                  url: 'https://www.cmaotai.com/API/CreateOrder.ashx',
                                  headers: {
                                      'cache-control': 'no-cache',
                                      'accept-language': 'zh-CN,en-US;q=0.8',
                                      accept: 'application/json, text/javascript, */*; q=0.01',
                                      'content-type': 'application/x-www-form-urlencoded',
                                      referer: `https://www.cmaotai.com/ysh5/page/BuyInquiry/buyInquiryIndex.html?type=invoiceInfo&productId=${pid}&num=${quantity}`,
                                      'user-agent': userAgent,
                                      'x-requested-with': 'XMLHttpRequest'
                                  },
                                  form: {
                                      phoneCode: tel,
                                      productId: pid,
                                      quantity: quantity,
                                      couponsId: couponsId,
                                      addressId: scopeAddress,
                                      invioceId: -1,
                                      express: 14,
                                      shopId: shopId,
                                      sessid: aliSessionId,
                                      remark: '',
                                      subinfoId: '',
                                      timestamp121: now
                                  },
                                  jar: j
                              };
                              aliSessionId = null;
                              request(options, function(error, response, body) {
                                  if (error) {
                                      return reject(error);
                                  };
                                  console.log(colors.green('下单完成'+JSON.stringify(body)));
                                  return resolve(JSON.parse(body));
                              });
                          });
                        })
                    }
                }).catch(e => {
                    console.log(e);
                    return reject(e);
                })
        })
    }

    getAddressId(tel) {
        console.log('start get addressID from mobile:', tel);
        let now = +new Date();

        let options = {
            method: 'POST',
            url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                action: 'AddressManager.list',
                index: '1',
                size: '10',
                timestamp121: now
            },
            jar: j
        };

        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              let bodyJSON = JSON.parse(body);
              // console.log(bodyJSON.data.list[0])
              console.log('获取的地址id', bodyJSON.data.list[0].SId);
              return resolve(bodyJSON.data.list[0].SId);

          });
        })
    }

    getAllAddress(tel) {
        console.log('start get addressID from mobile:', tel);
        let now = +new Date();

        var options = {
            method: 'POST',
            url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                action: 'AddressManager.list',
                index: '1',
                size: '10',
                timestamp121: now
            },
            jar: j
        };

        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              let bodyJSON = JSON.parse(body);
              return resolve(bodyJSON.data.list);
          });
        })
    }

    _getOrders(userId) {

        let now = +new Date();

        var options = {
            method: 'POST',
            url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                action: 'OrdersManager.GetUserOrderInfo',
                userId: userId,
                index: '1',
                size: '10',
                timestamp121: now
            },
            json:true,
            jar: j
        };

        return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  return reject(error);
              }
              console.log(JSON.stringify(body));
              return resolve(body.data.Data);
          });
        })
    }

    getOrder(user, pass){
      let userAgent = this.userAgent(user);
      return new Promise((resolve, reject) => {
        this.login(user, pass, userAgent)
          .then(userinfo => {
            return this._getOrders(userinfo.data.UserId);
          })
          .then(data => {
            return resolve(data);
          })
          .catch(e => {
            return reject(e);
          })
      })
    }

    apointStatus(userAgent) {
      let now = +new Date();
      var options = {
          method: 'POST',
          url: 'https://www.cmaotai.com/API/Servers.ashx',
          headers: this.headers(userAgent),
          form: {
              action:'ReservationsManager.List',
              index:1,
              size:10,
              timestamp121: now
          },
          jar: j,
          json:true
      };

      return new Promise((resolve, reject) => {
          request(options, function(error, response, body) {
              if (error) {
                  console.log(error);
                  return reject(error);
              } else {
                console.log("预约列表查看");
                console.dir(body.data);
                if(body && body.data && body.data.datas && body.data.datas.length > 0)
                  return resolve(body.data.datas[0]);
                else{
                  return reject('没有预约列表');
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
    apointment(addressID, userAgent, pid = 391) {
        let now = +new Date();
        var options = {
            method: 'POST',
            url: 'https://www.cmaotai.com/API/Servers.ashx',
            headers: this.headers(userAgent),
            form: {
                action: 'ReservationsManager.Regist',
                addressID: addressID,
                pid: pid,
                timestamp121: now
            },
            jar: j
        };

        return new Promise((resolve, reject) => {

            request(options, function(error, response, body) {
                if (error) {
                    console.log(error);
                    return reject(error);
                } else {
                    console.log("预约结果", body);
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
            console.log("所有手机号预约结束");
            return callback(this.apintmentResults);
        }
        // phone = phone.trim();
        console.log(typeof sphone);
        if (typeof sphone === 'string') {
            var phone = sphone.trim();
            var pass = "123456"
        } else {
            var phone = sphone.phone.trim();
            var pass = sphone.pass.trim();
        }
        userAgent = this.userAgent(phone);
        console.log('开始预约:', phone);
        this.login(phone, pass, userAgent)
          .then(userinfo => {
              return this.getAddressId(phone)
          })
          .then((addressID) => {
              return this.LBSServer(addressID, phone, userAgent);
          })
          .then(data => {
              let addressID = data.addressID;
              return this.apointment(addressID, userAgent)
          })
          .then(apointmentRet => {
              let obj = {};
              obj[phone] = apointmentRet;
              this.apintmentResults.push(obj);
              console.log('预约结果', phone, apointmentRet);
              setTimeout(() => {
                  this.apointmentBySinglePhone(phones, userAgent, callback);
              }, 3000)

          })
          .catch(e => {
              console.log('error', e);
              let obj = {};
              obj[phone] = e.message;
              this.apintmentResults.push(obj);
              setTimeout(() => {
                  this.apointmentBySinglePhone(phones, userAgent, callback);
              }, 3000)
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
    _apointmentBySinglePhone(phone, callback) {
        phone = phone.trim();
        let userAgent = this.userAgent(phone);
        console.log('开始预约:', phone);
        this.login(phone, '123456', userAgent)
          .then(userinfo => {
            return this.getAddressId(phone)
          })
          .then((addressID) => {
            return this.LBSServer(addressID, phone, userAgent);
          })
          .then(data => {
            let addressID = data.addressID
            return this.apointment(addressID, userAgent)
          })
          .then(apointmentRet => {
            console.log('预约结果', phone, apointmentRet);
            callback(apointmentRet)
          })
          .catch(e => {
            console.log('error', e);
            callback(e)
          })
    }
}

module.exports = new MaotaiService();
