const AliVerify = require('./startAliVerify');
let assert = require("chai").assert;

describe('测试阿里组件', () => {
  // it("截屏测试", () => {
  //   AliVerify.capture();
  //   assert.equal("ok", "ok");
  // })

  it("获取起始点和结束点", (done) => {
    AliVerify.calcPos(Points=>{
      assert.notEqual(Points[0][0], 0);
      assert.notEqual(Points[0][1], 0);
      assert.notEqual(Points[1][0], 0);
      assert.notEqual(Points[1][1], 0);
      done();
    });
  })


});
