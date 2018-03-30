const proxy = require('../controllers/proxy');
const logger = require('../controllers/logger');
const Service = require('../tools/service.js');
/**
 * 更新数据库所有的账号信息
 * 1、更新收货地址
 * 2、更新预约状态
 * 3、更新订单信息
 * 都只取第一条信息
 */

class AccountInfo {

    /**
     * updateAddress - 更新账号地址信息
     *
     * @return {type}  description
     */
    updateAddress() {

    }


    /**
     * updateApointStatus - 更新预约状态
     *
     * @return {type}  description
     */
    updateApointStatus() {

    }


    /**
     * updateOrderId - 更新订单信息
     *
     * @return {type}  description
     */
    updateOrderId() {

    }

    updateAccount(user) {
        let userid = "";
        let userAgent = Service.userAgent(user.phone);
        return new Promise((resolve, reject) => {
                let addressInfo = {};
                let apointStatus = {};
                proxy.switchIp()
                    .then(() => {
                        // 登录
                        return Service.login(user.phone, user.pass, userAgent);
                    })
                    .then((userinfo) => {
                        // 获取第一条地址信息
                        logger.info(userinfo);
                        userid = userinfo.UserId;
                        return Service.getAllAddress(user.phone);
                    })
                    .then(addressList => {
                      // state_1: "审核中",
                      // state_2: "预约失败",
                      // state_3: "预约成功",
                      // state_4: "已使用",
                      // state_5: "申诉中",
                      // state_6: "已失效"
                      logger.info('所有地址条数为', addressList.length);
                      logger.info(addressList[0]);
                      if (addressList.length > 0) {
                          addressInfo = addressList[0];
                      }
                      return Service.apointStatus(userAgent);
                    })
                    .then((_apointStatus) => {
                        if(_apointStatus){
                          apointStatus = _apointStatus
                        }
                        return Service._getOrders(userid);
                    })
                    .then((orderInfo) => {
                        if (orderInfo.length > 0) {
                            logger.info('order info', orderInfo[0]);
                            let orderDate = +(new Date(orderInfo[0].OrderDate));
                            let orderStatus = orderInfo[0].OrderStatus;
                            let now = (+new Date());
                            // 交易完成并且交易时间+7天大于当前时间账号应该被锁定
                            return resolve({
                              phone: user.phone,
                              pass: user.pass,
                              address: addressInfo.Address,
                              name: addressInfo.ShipTo,
                              ProvinceId: addressInfo.ProvinceId,
                              CityId: addressInfo.CityId,
                              DistrictsId: addressInfo.DistrictsId,
                              lng: addressInfo.Longitude,
                              lat: addressInfo.Latitude,
                              OrderDate: orderInfo[0].OrderDate,
                              OrderStatus: orderInfo[0].OrderStatus,
                              PayStatus: orderInfo[0].PayStatus,
                              ShopId:orderInfo[0].ShopId,
                              apointStatus: apointStatus.status || "",
                              buyStartTime: apointStatus.buyStartTime || "",
                              buyEndTime: apointStatus.buyEndTime || "",
                              reviewInfo:apointStatus.reviewInfo || "",
                              remark: "账号还在锁定期内，暂时不能购买"
                            })

                        } else {
                            return resolve({
                                phone: user.phone,
                                pass: user.pass,
                                address: addressInfo.Address,
                                name: addressInfo.ShipTo,
                                ProvinceId: addressInfo.ProvinceId,
                                CityId: addressInfo.CityId,
                                DistrictsId: addressInfo.DistrictsId,
                                lng: addressInfo.Longitude,
                                lat: addressInfo.Latitude,
                                OrderDate: '',
                                OrderStatus: '',
                                PayStatus: '',
                                ShopId:'',
                                apointStatus: apointStatus.status || "",
                                buyStartTime: apointStatus.buyStartTime || "",
                                buyEndTime: apointStatus.buyEndTime || "",
                                reviewInfo:apointStatus.reviewInfo || "",
                                remark: ""
                            })
                        }
                    }).catch(e => {
                        logger.error(e);
                        return resolve({
                            phone: user.phone,
                            pass: user.pass,
                            remark: e.message
                        })
                    });
            })
            .catch(e => {
                logerr.error(e);
                return resolve({
                    phone: user.phone,
                    pass: user.pass,
                    remark: e.message
                });
            })
    }
}


module.exports = new AccountInfo();