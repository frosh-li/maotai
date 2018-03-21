
const request = require('request');

let baiduAK = "144d946a1d5c7b48c7e9a604ec5979cd";
let loc = "39.811828,116.347906";

class BaiduService {

  get baiduAK(){
    return "144d946a1d5c7b48c7e9a604ec5979cd";
  }

  get apiURL() {
    return `https://api.map.baidu.com/place/v2/search?ak=${this.baiduAK}`;
  }

  get loc() {
    return "39.811828,116.347906";
  }

  set loc(data){
    this.loc = data;
  }

  getPoit(address){
    let url = `${this.apiURL}`;
    return new Promise((resolve, reject) => {
      this.geoDecoder(address)
        .then(location => {
          let params = {
            query:"小区",
            tag:"房地产",
            location: `${location.lat},${location.lng}`,
            radius: 1000,
            output:"json",
          }
          let reqUrl = this.buildUrl(url, params);
          console.log('poit',reqUrl);
          request({
            url:reqUrl,
            method:'get',
            json:true,
          }, function(error, response, body){
            if(error){
              console.log(error);
              return reject(error);
            }

            console.log('body:',body);
            return resolve(body);

          })
        })
        .catch(e => {
          return reject(e);
        })
    })

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
  geoDecoder(address){
    let url = `http://api.map.baidu.com/geocoder/v2/?address=${encodeURIComponent(address)}&output=json&ak=${baiduAK}`;
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
        if(body.status === 0 && body.result){
          return resolve({
            lng: body.result.location.lng,
            lat: body.result.location.lat
          })
        }else{
          return reject(new Error('解析失败'))
        }
      })
    })
  }
}
let service = new BaiduService();

module.exports = service;