const AccountService = require('../script/updateAccounts');
let assert = require("chai").assert;

describe('测试账号信息提取', () => {

  // it("获取起始点和结束点", (done) => {
  //   AliVerify.calcPos(Points=>{
  //     assert.notEqual(Points[0][0], 0);
  //     assert.notEqual(Points[0][1], 0);
  //     assert.notEqual(Points[1][0], 0);
  //     assert.notEqual(Points[1][1], 0);
  //     done();
  //   });
  // })

  it("测试账号信息提取", (done) => {
      AccountService.updateAccount({
        phone: "15330066919",
        pass: "110520"
      })
  })
});
