const MaotaiService = require('../tools/service');
let fs = require('fs');
var mysql      = require('mysql');
let logger = require('../controllers/logger');

class GrabController {
  constructor(account, callback){
    console.log(account);
    this.account = account;

    this.connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '123456',
      database : 'accounts'
    });
    this.callback = callback;
    this.connection.connect();
    this.startBind();
  }

  startBind() {
    let scopeJar = null;
    MaotaiService.getCurrentJar(this.account.phone)
      .then(j => {
        scopeJar = j;
        // return MaotaiService.getProductInfo(this.account, this.account.addressId, scopeJar);
        return MaotaiService.GrabLogin(this.account, this.account.addressId, scopeJar);
      })

      .then(data => {
        if(data.code !== 0){
          return this.callback(data);
        }
        return MaotaiService.GrabDefaultAdd(this.account, this.account.addressId, scopeJar);
      })
      .then(data => {
        return MaotaiService.GrabSubmit(this.account, this.account.addressId, scopeJar);
      })
      .then(data => {
        console.log(data);
        if(data.code === 0){
          return MaotaiService.grabStatus(this.account , scopeJar)
        }else{
          return Promise.reject(new Error("下单失败"));
        }
      })
      .then(data => {
        let sid = "";
        data.forEach(item => {
          if(item.sid === '211110105016'){
            // 说明已经下单成功
            sid = item.sid;
            return;
          }
        })
        return this.callback(null, sid);
      })
      .catch(e => {
        return this.callback(e);
        console.log(e);
      })
  }

  updateAccountBindInfo() {
    let conn = this.connection;
    conn.query(
      ` update
        accounts
        set bandShopId = "${this.shopID}"
        where phone = "${this.account.phone}"
      `, this.callback)
  }
}

module.exports = GrabController;
