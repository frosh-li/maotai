
const request = require('request');

let baiduAK = "144d946a1d5c7b48c7e9a604ec5979cd";
let loc = "39.811828,116.347906";

class BaiduService {

  get baiduAK(){
    return "144d946a1d5c7b48c7e9a604ec5979cd";
  }

  get apiURL() {
    return `https://restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=462f27e00614a30baa9ed1864455213f&city=&callback=&platform=JS&logversion=2.0&sdkversion=1.4.0`;
  }

  get loc() {
    return "39.811828,116.347906";
  }

  set loc(data){
    this.loc = data;
  }

  getPoit(address, page_num=0){
    let url = `${this.apiURL}`;
    return this.geoDecoder(address, page_num);

  }

  buildUrl(url, params){
    let ret = [];
    for(let key in params){
      ret.push(`${key}=${encodeURIComponent(params[key])}`);
    }
    return url + "&" + ret.join("&");
  }


  /**
   * geoDecoder - 根据地址获取经纬度
   *
   * @param  {type} address description
   * @return {type}         description
   */
  geoDecoder(address, page_num=1){
    let offset = 25;
    let page = page_num;
    let url = `${this.apiURL}&keywords=${encodeURIComponent(address)}&offset=${offset}&page=${page}`;
    return new Promise((resolve, reject) => {
      console.log(url);
      request({
        url:url,
        method:'get',
        json:true,
      }, function(error, response, body){
        if(error){
          console.log(error);
          return reject(error);
        }
        console.log(body);
        if(body.status == 1 && body.tips && body.tips.length > 0){
          return resolve(body.tips)
        }else{
          return reject(new Error('解析失败'))
        }
      })
    })
  }
}
let service = new BaiduService();

module.exports = service;
