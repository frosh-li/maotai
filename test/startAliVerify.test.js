const AliVerify = require('../tools/startAliVerify');
const MaotaiService = require('../tools/service');
const fs = require('fs');
const path = require('path');
let assert = require("chai").assert;

describe('阿里组建测试', () => {

  // it("获取起始点和结束点", (done) => {
  //   AliVerify.calcPos(Points=>{
  //     assert.notEqual(Points[0][0], 0);
  //     assert.notEqual(Points[0][1], 0);
  //     assert.notEqual(Points[1][0], 0);
  //     assert.notEqual(Points[1][1], 0);
  //     done();
  //   });
  // })

  it("测试打开阿里验证组建", (done) => {

      fs.writeFileSync(path.resolve(__dirname,"../aliSessionId.txt"), "");
      AliVerify.connectSidFromHard()
        .then((ok) => {
            MaotaiService.checkAliToken((token)=>{
              done();
            })
        })
        .catch(e => {
            console.log('ali error', e);
            assert.notEqual(true, true);
            done();
        })
  })
});
