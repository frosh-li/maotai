const logger = require('../controllers/logger.js');
const MaotaiService = require('../tools/service');

var originPhones = require("../beijing4.2buy.json");
originPhones = [
  {"phone":"13618484713","pass":"zxcvbnm"},
  {"phone":"17753583852","pass":"123456"},
  {"phone":"15213163729","pass":"123456"},
  {"phone":"17783920137","pass":"xqh19950703"},
  {"phone":"18236877936","pass":"wxp800614"},
  {"phone":"15178421370","pass":"2016whczg"},
  {"phone":"15084425825","pass":"lh25802580"},
  {"phone":"17772324023","pass":"lh25802580"},
  {"phone":"13786958413","pass":"58585858"},
  {"phone":"13711949575","pass":"wy40324700"},
  {"phone":"13686135579","pass":"wy40324700"},
  {"phone":"15717350785","pass":"dyj395799."},
  {"phone":"18273181619","pass":"dyj395799."},
]

function start() {
  let user = originPhones.shift();
  if(!user){
    logger.info("全部登录完成");
    return;
  }
  let userAgent = MaotaiService.userAgent(user.phone);
  MaotaiService.login(user.phone, user.pass, userAgent)
    .then(data => {
      logger.info(data);
      start();
    })
    .catch(e => {
      logger.error(e);
      start();
    })
}

start();
