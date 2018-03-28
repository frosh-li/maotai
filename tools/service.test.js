const Service = require('./service');
let assert = require("chai").assert;

describe('测试Service', () => {
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
    let userAgent = Service.userAgent();
    console.log(userAgent);
    assert.equal(typeof userAgent, 'string');
    done();
  })

  it("测试阿里token", (done) => {
    Service.checkAliToken((token) => {
      console.log(token);
      assert.equal(typeof token, 'string');
      done();
    })
  })


});
