/**
 * 消息发送测试接口
 */

var crypto = require('crypto');

var md5 = crypto.createHash('md5');

var request = require('request');

var config = require('./config');
var logger = require('../controllers/logger');
const pass = tomd5(config.pass);

function tomd5(pass){
    md5.update(pass);
    var sign = md5.digest('hex');
    return sign.toUpperCase();
}

function getbizId(){
    var now = new Date();
    var ret= now.toLocaleDateString().replace(/[-:\/]/g,"")+now.toLocaleTimeString().replace(/[-:\/]/g,"");

    logger.info('bizId', ret);
    return ret;
}

function sendmsg(mobile, content){
    let postData = {
        accName:config.user,
        accPwd:pass,
        aimcodes:mobile,
        content:content+"【BMS】",
        bizId:getbizId(),
        dataType:"json"
    };
    logger.info('posturl', config.url)
    logger.info('postData',JSON.stringify(postData));
    return new Promise((resolve, reject)=>{
    
        request({
            method:"post",
            url:config.url,
            json:true,
            form:postData,
            body:postData
        }, function(err,_,body){
            if(err){
                logger.info(err);
                return reject(err);
            }
            logger.info(JSON.stringify(body));
            return resolve(body);
        })
    
    })
}

module.exports = sendmsg;
