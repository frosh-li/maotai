/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');
const sendmsg = require('../sendmsg/');
const fs = require('fs');
const colors = require('colors/safe');
const Utils = require('../services/utils');
const request = require('request');
const proxy = require('../controllers/proxy');
let startIndex = 1;
let startId = `${startIndex}${process.argv[2].substring(0,2)}${process.argv[2]}001`;
let activityUrl = "https://www.cmaotai.com/API/Servers.ashx";
let results = [];
let times = 0;
function parseID(){
  let now = +new Date();
  console.log('开始解析', startId);
  request({
    method: "post",
    url:`${activityUrl}`,
    method: 'POST',
    url: 'https://www.cmaotai.com/API/Servers.ashx',
    form: {
        action: 'ActivityManager.Activitys',
        pid: 0,
        sid: startId,
        timestamp121: now
    },
    json:true,
  }, (err, response, body)=>{
    if(err){
      console.log(err)
      return;
    }
    if(times < 30){
      // console.log(body.data.Network);
      if(body && body.code === 0 && body.data.Network){
        let Network = body.data.Network;
        results.push({
          id: Network.Sid,
          name: Network.SName,
          address: Network.Address,
          tel:Network.LinkTel,
          dname:Network.DName
        })
      }
      times++;
      startId++;
      parseID();
    }else{
      // fs.writeFileSync(`./networks/${startId.toString().substring(3,9)}.json`, JSON.stringify(results));
      console.log(startIndex+'完成');
      startIndex++;
      times =0;
      if(startIndex > 2){
        fs.writeFileSync(`./networks/${startId.toString().substring(3,9)}.json`, JSON.stringify(results,null, 4));
        console.log("全部完成");
        process.exit();
        return;
      }else{
        startId = `${startIndex}${process.argv[2].substring(0,2)}${process.argv[2]}001`;
        parseID();
      }
    }

  })
}
// { "areaCode": "110101", "parentCode": "110100", "areaName": "东城区" },
// { "areaCode": "110102", "parentCode": "110100", "areaName": "西城区" },
// { "areaCode": "110105", "parentCode": "110100", "areaName": "朝阳区" },
// { "areaCode": "110106", "parentCode": "110100", "areaName": "丰台区" },
// { "areaCode": "110107", "parentCode": "110100", "areaName": "石景山区" },
// { "areaCode": "110108", "parentCode": "110100", "areaName": "海淀区" },
// { "areaCode": "110109", "parentCode": "110100", "areaName": "门头沟区" },
// { "areaCode": "110111", "parentCode": "110100", "areaName": "房山区" },
// { "areaCode": "110112", "parentCode": "110100", "areaName": "通州区" },
// { "areaCode": "110113", "parentCode": "110100", "areaName": "顺义区" },
// { "areaCode": "110114", "parentCode": "110100", "areaName": "昌平区" },
// { "areaCode": "110115", "parentCode": "110100", "areaName": "大兴区" },
// { "areaCode": "110116", "parentCode": "110100", "areaName": "怀柔区" },
// { "areaCode": "110117", "parentCode": "110100", "areaName": "平谷区" },
// { "areaCode": "110118", "parentCode": "110100", "areaName": "密云区" },
// { "areaCode": "110119", "parentCode": "110100", "areaName": "延庆区" },
parseID();