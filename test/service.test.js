const Service = require('../tools/service');
let assert = require("chai").assert;

describe('接口通用函数测试', () => {
  // it("截屏测试", () => {
  //   AliVerify.capture();
  //   assert.equal("ok", "ok");
  // })

  it("MD5函数测试", (done) => {
    let sign = Service.md5('1111');
    console.log(sign);
    assert.equal(sign.length===32, true);
    done();
  })

  it("随机生成UserAgent", (done) => {
    let oldUserAgent = "Mozilla/5.0 (Linux; Android 4.4.4; LA2-SN Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[android/1.0.23/a4655395fc589925e765f1afc665f669/f182f85e816d19ba77f864252011df1a]";
    let userAgent = Service.userAgent("15330066919");
    console.log(userAgent);
    assert.equal(userAgent, oldUserAgent);
    done();
  })

  it("测试预约", (done) => {
      let phones =[
        {
            phone: "15063527328",
            pass: "123456"
        },
        {
            phone: "15610959065",
            pass: "123456"
        },
        {
            phone: "13907971151",
            pass: "w011765"
        }
        ,
        {
            phone: "15075870950",
            pass: "123456"
        }
        ,
        {
            phone: "13102661153",
            pass: "123456"
        }
        ,
        {
            phone: "19909021857",
            pass: "jyx741118"
        }
        ,
        {
            phone: "15234324013",
            pass: "654321"
        }
        ,
        {
            phone: "13465386355",
            pass: "anjiaqi112828"
        }
        ,
        {
            phone: "18161154033",
            pass: "zjq741118"
        }
        ,
        {
            phone: "13165188009",
            pass: "123456"
        }
      ];
      Service.apointmentMulti(phones, (data) => {
          console.log(data);
          assert.equal(true, true),
          done();
      })
  })

});
