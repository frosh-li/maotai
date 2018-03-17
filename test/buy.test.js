const Service = require('../tools/service');
let assert = require("chai").assert;
const MaotaiService = require('../tools/service');
/**
* 测试自动购买流程
*/
const phones = [
    {"phone":"17097224268","pass":"123456"},
    {"phone":"18946959184","pass":"123456"},
    {"phone":"13413723166","pass":"123456"}
]
describe("自动购买流程测试", ()=>{
    it("批量购买", (done) => {
        let tels = phones;
        let pid = 405;
        let quantity = 6;
        let ret = [];
        function createOne() {
          let tel = tels.shift();
          if(!tel){
            console.log('alldone', ret);
            done();
            return;
          }
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
        setTimeout(createOne, 10);
    })
})
