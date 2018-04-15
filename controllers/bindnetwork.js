const MaotaiService = require('../tools/service');
let fs = require('fs');
var mysql      = require('mysql');
let logger = require('../controllers/logger');

class BindNetwork {
  constructor(account, shopID, callback){
    console.log(account, shopID);
    this.account = account;
    this.shopID = shopID
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
    MaotaiService.getCurrentJar(this.account.phone)
      .then(j => {
        return MaotaiService.bindNetwork(this.account.phone, this.shopID, j);
      })
      .then(data => {
        this.updateAccountBindInfo();
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

module.exports = BindNetwork;
