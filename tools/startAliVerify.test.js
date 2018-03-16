const AliVerify = require('./startAliVerify');
let assert = require("chai").assert;
// let getPixels = require('get-pixels');
AliVerify.connectSidFromHard().then(data => {
  console.log(data)
}).catch(e=>{
  console.log(e);
});


// describe('测试阿里组件', () => {
//   // it("截屏测试", () => {
//   //   AliVerify.capture();
//   //   assert.equal("ok", "ok");
//   // })
//
//   it("远程打开滑动验证组件", () => {
//     AliVerify.openAliUI();
//     // 开始截屏
//     setTimeout(()=>{
//       AliVerify.capture();
//       assert.equal("ok", "ok");
//     },4000);
//     //
//   })
//
//
// });
