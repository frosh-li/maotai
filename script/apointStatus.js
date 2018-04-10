/**
 * 监控某一个站点是否已经可以抢货了
 */
const logger = require('../controllers/logger.js');
const proxy = require('../controllers/proxy.js');
const MaotaiService = require('../tools/service');

const fs = require('fs');
originPhones = [
    {
        "phone": "18353874500",
        "pass": "anjiaqi112828",
        "addressId": 1787812
    },
    {
        "phone": "17853697903",
        "pass": "a123456",
        "addressId": 1951715
    },
    {
        "phone": "13333176802",
        "pass": "a123456",
        "addressId": 1930785
    },
    {
        "phone": "15549208672",
        "pass": "123456",
        "addressId": 1905922
    },
    {
        "phone": "15238555689",
        "pass": "a123456",
        "addressId": 1951714
    },
    {
        "phone": "13513642792",
        "pass": "a123456",
        "addressId": 1951737
    },
    {
        "phone": "18533703270",
        "pass": "a123456",
        "addressId": 1951805
    },
    {
        "phone": "15082907866",
        "pass": "a123456",
        "addressId": 1951812
    },
    {
        "phone": "15935492346",
        "pass": "a123456",
        "addressId": 1930788
    },
    {
        "phone": "15046846298",
        "pass": "a123456",
        "addressId": 1930700
    },
    {
        "phone": "13102661153",
        "pass": "123456",
        "addressId": 1698680
    },
    {
        "phone": "18709222182",
        "pass": "123456",
        "addressId": 1856770
    },
    {
        "phone": "13392151517",
        "pass": "123456",
        "addressId": 1894345
    },
    {
        "phone": "13413723166",
        "pass": "123456",
        "addressId": 1894654
    },
    {
        "phone": "13512856201",
        "pass": "wyp100721",
        "addressId": 1842614
    },
    {
        "phone": "15264711001",
        "pass": "123456",
        "addressId": 1935811
    },
    {
        "phone": "15393630594",
        "pass": "123456",
        "addressId": 1935813
    },
    {
        "phone": "15633523066",
        "pass": "abc123",
        "addressId": 1935815
    },
    {
        "phone": "15645919316",
        "pass": "123456",
        "addressId": 1861429
    },
    {
        "phone": "15697680921",
        "pass": "123456",
        "addressId": 1894280
    },
    {
        "phone": "15698229041",
        "pass": "123456",
        "addressId": 1894170
    },
    {
        "phone": "15699770933",
        "pass": "123456",
        "addressId": 1935816
    },
    {
        "phone": "15949806339",
        "pass": "lhj0325",
        "addressId": 1935818
    },
    {
        "phone": "17097224268",
        "pass": "123456",
        "addressId": 1894299
    },
    {
        "phone": "17505106529",
        "pass": "132623",
        "addressId": 1935819
    },
    {
        "phone": "17753747930",
        "pass": "8642569",
        "addressId": 1935821
    },
    {
        "phone": "17757449525",
        "pass": "123456",
        "addressId": 1894480
    },
    {
        "phone": "18131970041",
        "pass": "123456",
        "addressId": 1847451
    },
    {
        "phone": "18232902912",
        "pass": "108108li",
        "addressId": 1679931
    },
    {
        "phone": "18246626742",
        "pass": "jss19860529",
        "addressId": 1935822
    },
    {
        "phone": "18253251389",
        "pass": "123456",
        "addressId": 1843317
    },
    {
        "phone": "18382394514",
        "pass": "123456",
        "addressId": 1840503
    },
    {
        "phone": "18810320392",
        "pass": "12345678",
        "addressId": 1686181
    },
    {
        "phone": "18863572962",
        "pass": "123456",
        "addressId": 1894344
    },
    {
        "phone": "18946959184",
        "pass": "123456",
        "addressId": 1893645
    },
    {
        "phone": "18967839427",
        "pass": "123456",
        "addressId": 1894367
    },
    {
        "phone": "15582882641",
        "pass": "a123456",
        "addressId": 1961845
    },
    {
        "phone": "15535890431",
        "pass": "a123456",
        "addressId": 1961873
    },
    {
        "phone": "15535486077",
        "pass": "a123456",
        "addressId": 1961944
    },
    {
        "phone": "13895490886",
        "pass": "a123456",
        "addressId": 1961951
    },
    {
        "phone": "15081664435",
        "pass": "a123456",
        "addressId": 1961952
    },
    {
        "phone": "13283936032",
        "pass": "a123456",
        "addressId": 1962184
    },
    {
        "phone": "15081820867",
        "pass": "a123456",
        "addressId": 1962191
    },
    {
        "phone": "15035399985",
        "pass": "a123456",
        "addressId": 1962205
    },
    {
        "phone": "18291130651",
        "pass": "a123456",
        "addressId": 1962206
    },
    {
        "phone": "13676343367",
        "pass": "a123456",
        "addressId": 1962219
    },
    {
        "phone": "15257918657",
        "pass": "a123456",
        "addressId": 1962220
    },
    {
        "phone": "15039298864",
        "pass": "a123456",
        "addressId": 1962228
    },
    {
        "phone": "18818426811",
        "pass": "a123456",
        "addressId": 1962236
    },
    {
        "phone": "15257918657",
        "pass": "a123456",
        "addressId": 1962220
    },
    {
        "phone": "13720689056",
        "pass": "a123456",
        "addressId": 1951717
    },
    {
        "phone": "13546886639",
        "pass": "qin141208",
        "addressId": 1935801
    },
    {
        "phone": "18331375226",
        "pass": "a123456",
        "addressId": 1961830
    },
    {
        "phone": "15981953127",
        "pass": "123456",
        "addressId": 1841839
    },
    {
        "phone": "13153185002",
        "pass": "123456",
        "addressId": 1893802
    },
    {
        "phone": "13343192376",
        "pass": "123456",
        "addressId": 1885157
    },
    {
        "phone": "13485665212",
        "pass": "123456",
        "addressId": 1676457
    },
    {
        "phone": "13700077519",
        "pass": "123456",
        "addressId": 1892989
    },
    {
        "phone": "15063527328",
        "pass": "123456",
        "addressId": 1893768
    },
    {
        "phone": "15075870950",
        "pass": "123456",
        "addressId": 1712578
    },
    {
        "phone": "15206334886",
        "pass": "123456",
        "addressId": 1903115
    },
    {
        "phone": "15303199414",
        "pass": "123456",
        "addressId": 1885243
    },
    {
        "phone": "15354193781",
        "pass": "123456",
        "addressId": 1879769
    },
    {
        "phone": "15373204143",
        "pass": "123456",
        "addressId": 1885212
    },
    {
        "phone": "15399130078",
        "pass": "125018adg",
        "addressId": 1697988
    },
    {
        "phone": "15515970953",
        "pass": "123456",
        "addressId": 1843374
    },
    {
        "phone": "15937230461",
        "pass": "123456",
        "addressId": 1845446
    },
    {
        "phone": "15951853170",
        "pass": "123456",
        "addressId": 1885124
    },
    {
        "phone": "17379324087",
        "pass": "123456",
        "addressId": 1858864
    },
    {
        "phone": "18537303412",
        "pass": "z410781",
        "addressId": 1726502
    },
    {
        "phone": "15777186432",
        "pass": "15177909309",
        "addressId": 1935817
    },
    {
        "phone": "15835086989",
        "pass": "a123456",
        "addressId": 1951725
    },
    {
        "phone": "18743635726",
        "pass": "a123456",
        "addressId": 1951735
    },
    {
        "phone": "13081312422",
        "pass": "a123456",
        "addressId": 1951801
    },
    {
        "phone": "13624666057",
        "pass": "a123456",
        "addressId": 1930787
    },
    {
        "phone": "13842111030",
        "pass": "a123456",
        "addressId": 1930791
    },
    {
        "phone": "18903188059",
        "pass": "a123456",
        "addressId": 1930701
    },
    {
        "phone": "13792080758",
        "pass": "a123456",
        "addressId": 1930706
    },
    {
        "phone": "13313181385",
        "pass": "a123456",
        "addressId": 1930707
    },
    {
        "phone": "17535275750",
        "pass": "123456",
        "addressId": 1892886
    },
    {
        "phone": "13336323159",
        "pass": "4063443",
        "addressId": 1935794
    },
    {
        "phone": "13351208936",
        "pass": "jss19860529",
        "addressId": 1935795
    },
    {
        "phone": "13399381732",
        "pass": "q123456",
        "addressId": 1935796
    },
    {
        "phone": "13453301621",
        "pass": "654321",
        "addressId": 1935797
    },
    {
        "phone": "13521690981",
        "pass": "123456",
        "addressId": 1935799
    },
    {
        "phone": "13633696711",
        "pass": "w070416",
        "addressId": 1935803
    },
    {
        "phone": "13764763451",
        "pass": "123456",
        "addressId": 1847409
    },
    {
        "phone": "13938038163",
        "pass": "123456",
        "addressId": 1935805
    },
    {
        "phone": "13993852417",
        "pass": "q123456",
        "addressId": 1935806
    },
    {
        "phone": "15039586436",
        "pass": "123456",
        "addressId": 1935807
    },
    {
        "phone": "15102549597",
        "pass": "ml080727",
        "addressId": 1935808
    },
    {
        "phone": "15131828567",
        "pass": "123456",
        "addressId": 1935809
    },
    {
        "phone": "15264711296",
        "pass": "123456",
        "addressId": 1935812
    },
    {
        "phone": "18032952504",
        "pass": "123456",
        "addressId": 1879695
    },
    {
        "phone": "17612746321",
        "pass": "123456321654",
        "addressId": 1935820
    },
    {
        "phone": "18201603185",
        "pass": "123456",
        "addressId": 1884119
    },
    {
        "phone": "18207517996",
        "pass": "123456",
        "addressId": 1829922
    },
    {
        "phone": "18333966217",
        "pass": "123456",
        "addressId": 1879800
    },
    {
        "phone": "15627944858",
        "pass": "123456",
        "addressId": 1894176
    },
    {
        "phone": "18834168128",
        "pass": "A3396815",
        "addressId": 1898547
    },
    {
        "phone": "18982761259",
        "pass": "721025",
        "addressId": 1789878
    },
    {
        "phone": "13464686175",
        "pass": "a123456",
        "addressId": 1951713
    },
    {
        "phone": "18864854877",
        "pass": "a123456",
        "addressId": 1951722
    },
    {
        "phone": "13463414918",
        "pass": "a123456",
        "addressId": 1951723
    },
    {
        "phone": "18764735850",
        "pass": "a123456",
        "addressId": 1951724
    },
    {
        "phone": "15247493282",
        "pass": "a123456",
        "addressId": 1951726
    },
    {
        "phone": "17393232815",
        "pass": "a123456",
        "addressId": 1951729
    },
    {
        "phone": "15830750275",
        "pass": "a123456",
        "addressId": 1951732
    },
    {
        "phone": "17879529656",
        "pass": "a123456",
        "addressId": 1951733
    },
    {
        "phone": "18698817813",
        "pass": "a123456",
        "addressId": 1951753
    },
    {
        "phone": "13230672756",
        "pass": "a123456",
        "addressId": 1951804
    },
    {
        "phone": "18183062125",
        "pass": "a123456",
        "addressId": 1951807
    },
    {
        "phone": "18438063310",
        "pass": "a123456",
        "addressId": 1951811
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782
    },
    {
        "phone": "13593493641",
        "pass": "a123456",
        "addressId": 1930789
    },
    {
        "phone": "15613794675",
        "pass": "a123456",
        "addressId": 1930792
    },
    {
        "phone": "15249625137",
        "pass": "a123456",
        "addressId": 1930699
    },
    {
        "phone": "15665166293",
        "pass": "a123456",
        "addressId": 1951731
    },
    {
        "phone": "15635316166",
        "pass": "a123456",
        "addressId": 1961824
    },
    {
        "phone": "15535874373",
        "pass": "a123456",
        "addressId": 1961826
    },
    {
        "phone": "18734572393",
        "pass": "a123456",
        "addressId": 1961844
    },
    {
        "phone": "15660773191",
        "pass": "a123456",
        "addressId": 1961868
    },
    {
        "phone": "13843910857",
        "pass": "a123456",
        "addressId": 1961870
    },
    {
        "phone": "15386030922",
        "pass": "a123456",
        "addressId": 1961872
    },
    {
        "phone": "15535890431",
        "pass": "a123456",
        "addressId": 1961873
    },
    {
        "phone": "17635568238",
        "pass": "a123456",
        "addressId": 1961943
    },
    {
        "phone": "15535486077",
        "pass": "a123456",
        "addressId": 1961944
    },
    {
        "phone": "13895490886",
        "pass": "a123456",
        "addressId": 1961951
    },
    {
        "phone": "15081664435",
        "pass": "a123456",
        "addressId": 1961952
    },
    {
        "phone": "13781072791",
        "pass": "a123456",
        "addressId": 1961955
    },
    {
        "phone": "15716559528",
        "pass": "a123456",
        "addressId": 1961956
    },
    {
        "phone": "15121952364",
        "pass": "a123456",
        "addressId": 1961957
    },
    {
        "phone": "15330512791",
        "pass": "a123456",
        "addressId": 1961959
    },
    {
        "phone": "15042695614",
        "pass": "a123456",
        "addressId": 1962183
    },
    {
        "phone": "13283936032",
        "pass": "a123456",
        "addressId": 1962184
    },
    {
        "phone": "18632369087",
        "pass": "a123456",
        "addressId": 1962186
    },
    {
        "phone": "13290979032",
        "pass": "a123456",
        "addressId": 1962187
    },
    {
        "phone": "13936763461",
        "pass": "a123456",
        "addressId": 1962189
    },
    {
        "phone": "15081820867",
        "pass": "a123456",
        "addressId": 1962191
    },
    {
        "phone": "15896028013",
        "pass": "a123456",
        "addressId": 1962192
    },
    {
        "phone": "17631643045",
        "pass": "a123456",
        "addressId": 1962196
    },
    {
        "phone": "15053052761",
        "pass": "a123456",
        "addressId": 1962199
    },
    {
        "phone": "17844202122",
        "pass": "a123456",
        "addressId": 1962200
    },
    {
        "phone": "18434763969",
        "pass": "a123456",
        "addressId": 1962204
    },
    {
        "phone": "15035399985",
        "pass": "a123456",
        "addressId": 1962205
    },
    {
        "phone": "18291130651",
        "pass": "a123456",
        "addressId": 1962206
    },
    {
        "phone": "15235364989",
        "pass": "a123456",
        "addressId": 1962212
    },
    {
        "phone": "15003443253",
        "pass": "a123456",
        "addressId": 1962214
    },
    {
        "phone": "17131970724",
        "pass": "a123456",
        "addressId": 1962215
    },
    {
        "phone": "15319647574",
        "pass": "a123456",
        "addressId": 1969314
    },
    {
        "phone": "17667374197",
        "pass": "a123456",
        "addressId": 1962216
    },
    {
        "phone": "17603803317",
        "pass": "a123456",
        "addressId": 1962217
    },
    {
        "phone": "13676343367",
        "pass": "a123456",
        "addressId": 1962219
    },
    {
        "phone": "15257918657",
        "pass": "a123456",
        "addressId": 1962220
    },
    {
        "phone": "13209986285",
        "pass": "a123456",
        "addressId": 1962222
    },
    {
        "phone": "15505201939",
        "pass": "a123456",
        "addressId": 1962224
    },
    {
        "phone": "18831099037",
        "pass": "a123456",
        "addressId": 1969317
    },
    {
        "phone": "15039298864",
        "pass": "a123456",
        "addressId": 1962228
    },
    {
        "phone": "18534866149",
        "pass": "a123456",
        "addressId": 1962233
    },
    {
        "phone": "13316547635",
        "pass": "a123456",
        "addressId": 1962235
    },
    {
        "phone": "18818426811",
        "pass": "a123456",
        "addressId": 1962236
    },
    {
        "phone": "15034681449",
        "pass": "a123456",
        "addressId": 1962237
    },
    {
        "phone": "15133355337",
        "pass": "a123456",
        "addressId": 1962238
    },
    {
        "phone": "15257918657",
        "pass": "a123456",
        "addressId": 1962220
    },
    {
        "phone": "18331375226",
        "pass": "a123456",
        "addressId": 1961830
    },
    {
        "phone": "18256710448",
        "pass": "a123456",
        "addressId": 1961877
    }
];
let tels = [];
originPhones.forEach(data => {
  tels.push(JSON.stringify(data));
})
tels = tels.join("|");

logger.info('to Buy tels', originPhones);
let pid = '391';
let quantity = 6;
let statusResults = [];
let successAcount = [];
let failAccount = [];
function getStatus(){
  let phone = originPhones.shift();
  logger.info('还剩下'+originPhones.length+'个检测');
  if(!phone){
    logger.info("检查完成");
    console.log("预约成功列表如下");
    console.log(JSON.stringify(successAcount));
    console.log("预约失败列表如下");
    console.log(JSON.stringify(failAccount));
    return;
  }
  logger.info('start to check status', phone);
  let userAgent = MaotaiService.userAgent(phone.phone);
  proxy.switchIp().then(() => {
    let scopeJar = "";
    MaotaiService.getCurrentJar(phone.phone)
      .then((j) => {
          scopeJar = j;
          return MaotaiService.apointStatus(userAgent, j);
      })
      .then(data => {
        if(data.status == 3){
          logger.info("phone:"+phone.phone+"审核成功");
          // 3位审核成功
          successAcount.push({
            phone: phone.phone,
            pass:phone.pass,
            addressId: phone.addressId,
          })
        }else if(data.status == 1){
          logger.info("phone:"+phone.phone+"正在审核中");
          failAccount.push({
            phone: phone.phone,
            pass:phone.pass,
            address: data.address,
            registPhone: data.registPhone,
            receivePhone: data.receivePhone,
          })

        }else {
          logger.info("phone:"+phone.phone+"审核失败,"+ (data.reviewInfo && data.reviewInfo.split('。')[0]));
          failAccount.push({
            phone: phone.phone,
            pass:phone.pass,
            address: data.address,
            registPhone: data.registPhone,
            receivePhone: data.receivePhone,
            reviewInfo:data.reviewInfo && data.reviewInfo.split('。')[0],
          })
        }
        statusResults.push({
          receiver: data.receiver,
          address: data.address,
          reviewTime: data.reviewTime,
          status: data.status,
        });
        getStatus();
      })
      .catch(e => {
        logger.error(e);
        getStatus();
      })
  }).catch(e => {
    logger.error("代理切换失败", e);
    getStatus()
  })
}
getStatus()
