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

   updateAccount(user){
    let userid = "";
    let userAgent = Service.userAgent(user.phone);
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
      .then((addressList) => {
        logger.info('所有地址条数为',addressList.length);
        logger.info(addressList[0]);
        return Service._getOrders(userid);
      })
      .then((orderInfo) => {
        if(orderInfo.length > 0){
          logger.info('order info', orderInfo[0]);
        }
      }).catch(e => {
        console.log(e);
      });
   }
 }


 module.exports = new AccountInfo();
