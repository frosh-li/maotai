const Service = require('../tools/service');

const MaotaiService = require('../tools/service');
/**
* 测试自动购买流程
*/
const phones = [
    {"phone":"17097224268","pass":"123456"},
    {"phone":"18946959184","pass":"123456"},
    {"phone":"13413723166","pass":"123456"}
]

function deepClone(obj){
    var newObj= obj instanceof Array?[]:{};
    for(var i in obj){
       newObj[i]=typeof obj[i]=='object'?
       deepClone(obj[i]):obj[i];
    }
    return newObj;
}

function autoBuy() {
    let tels = deepClone(phones);
    console.log(tels);
    buy(tels);
}

function buy(phones){

    let tels = phones;
    let pid = 405;
    let quantity = 6;
    let ret = [];
    function createOne() {
        let tel = tels.shift();
        if(!tel){
            console.log('alldone', ret);
            let result = false;
            ret.forEach((data) => {
                if(data.status === "SUCCESS"){
                    result = true;
                }else{
                    result = false;
                }
            })

            if(result) {
                console.log("购买成功", ret);
                return;
            }else{
                console.log("购买失败，5S后重新开始购买流程");
                setTimeout(() => {
                    autoBuy();
                },5000)
            }
        }else{
            let userAgent = MaotaiService.userAgent(tel);
            MaotaiService.createOrder(tel, pid , quantity,userAgent)
                .then(data => {
                  if(data.code === 0){
                    ret.push({
                      tel: tel,
                      status: "SUCCESS",
                      data: data
                    })
                    console.log('create order success', tel, pid,'error');
                    setTimeout(createOne, 10);
                  }else{
                    console.log('create order fail', tel, pid,'error');
                    ret.push({
                      tel: tel,
                      status: "FAIL",
                      data: data
                    })
                    setTimeout(createOne, 10);
                  }

                }).catch(e=>{
                  ret.push({
                    tel: tel,
                    status: "FAIL",
                    error:e.message
                  })
                  console.log('create order fail', tel, pid,'error', e.message);
                  setTimeout(createOne, 10);
                })

        }
    }
    setTimeout(createOne, 10);
}


autoBuy();
