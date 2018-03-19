
/**
 * 检查密码是否正确
 */

var mysql      = require('mysql');
var request = require('request');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'accounts'
});

connection.connect();

connection.query('select * from accounts where status = 1', function (error, results, fields) {
  if (error) throw error;
  results.forEach(ret => {
    request({
      url:"http://127.0.0.1:10010/api/maotai/login",
      method:"post",
      form:{
        tel:ret.phone,
        pass:ret.pass
      }
    }, (error, response, body)=> {
      if(error){
        console.log(error);
      }else{
        console.log(body);
        body = JSON.parse(body);

        if(body.state === true && body.code === 0){
          console.log('phone:', ret.phone,'成功登陆')
        }else{
          console.log('phone:', ret.phone,'登陆失败');
          // 重置
          connection.query('update accounts set status=0 where phone=?',[ret.phone], function(err, res){
            if(err){
              console.log('重置状态失败',err)
              return;
            }
            console.log('重置状态成功');
          })
        }
      }
    })
  })
});
