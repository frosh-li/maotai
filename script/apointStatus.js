/**
 * 监控某一个站点是否已经可以抢货了
 */
const MaotaiService = require('../tools/service');
let _phones = [
  "15249625137",
  "15046846298",
  "18903188059",
  "13670589613",
  "13792080758",
  "13624666057",
  "15935492346",
  "13191162477",
  "15613794675",
]

var originPhones = [
  // {"phone":"13102661153", "pass":"123456"},
  // {"phone":"13153185002", "pass":"123456"},
  // {"phone":"13157440883", "pass":"123456"},
];

_phones.forEach(item => {
  originPhones.push({
    "phone":item,
    "pass":"a123456"
  })
});


let tels = [];
originPhones.forEach(data => {
  tels.push(JSON.stringify(data));
})
tels = tels.join("|");

console.log('to Buy tels', originPhones);
let pid = '391';
let quantity = 6;
let statusResults = [];
function getStatus(){
  let phone = originPhones.shift();
  if(!phone){
    console.log("检查完成");
    console.dir(statusResults);
    return;
  }
  console.log('start to check status', phone);
  let userAgent = MaotaiService.userAgent(phone.phone);
  MaotaiService.login(phone.phone, phone.pass, userAgent)
    .then(() => {
        return MaotaiService.apointStatus(userAgent);
    })
    .then(data => {
      statusResults.push(data);
      getStatus();
    })
    .catch(e => {
      getStatus();
    })
}

getStatus()
