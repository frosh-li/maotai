var request = require('request');

class Proxy {
  get proxyHost() {
    return "http-pro.abuyun.com";
  }

  get proxyPort(){
    return "9010";
  }

  get proxyUser() {
    return "HOE249Q35KY4298P";
  }

  get proxyPass() {
    return "D9681FDDA6AE24CA";
  }

  get proxyAuth() {
    let base64 = new Buffer(`${this.proxyUser}:${this.proxyPass}`).toString('base64');
    return base64;
    // return 'HOE249Q35KY4298P:D9681FDDA6AE24CA'
  }

  /**
   * getCurrentIp - 获取当前线路IP
   *
   * @return {type}  description
   */
  getCurrentIp() {
    request = request.defaults({
        jar: true,
        proxy: 'http://'+this.proxyUser+':'+this.proxyPass+'@'+this.proxyHost+':'+this.proxyPort,
    })
    request(
      {
        url: 'http://proxy.abuyun.com/current-ip',
        method:"get",
        headers: {
          "proxy-authorization" : "Basic " + this.proxyAuth,
        },
      },function(error, response, body){
      if(error){
        console.log(error);
        return;
      }
      console.log('线路信息:',body);
    })
  }

  switchIp() {
    request = request.defaults({
        jar: true,
        proxy: 'http://'+this.proxyUser+':'+this.proxyPass+'@'+this.proxyHost+':'+this.proxyPort,
    })
    return new Promise((resolve, reject) => {
      request(
        {
          url: 'http://proxy.abuyun.com/switch-ip',
          method:"get",
          headers: {
            "proxy-authorization" : "Basic " + this.proxyAuth,
          }
        }, function(error, response, body){
        if(error){
          console.log(error);
          return resolve(error);
        }
        console.log('切换线路:',body);
        return resolve(body);
      })
    })
  }
}

module.exports = new Proxy();
