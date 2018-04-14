const {fork} = require('child_process');
const path = require('path');
const fs = require('fs');
/**
 * 子进程管理器
 */
class processManager {

  /**
   * @static closeAllChild - 关闭所有子进程
   *
   * @return {type}  description
   */
  static closeAllChild() {
    processManager.all_child_process.forEach(item => {
      item.child.kill();
    })
  }

  static startAllProcess() {
    processManager.all_child_process.forEach(item => {
      item.child = fork(path.resolve(__dirname, "../script/watchMulti.js"), [item.path]);
      item.child.on('message', processManager.listenMsg)
    })
  }

  static reWriteFiles(tel, filepath) {
    fs.readFile(path.resolve(__dirname, filepath), function(err, data){
      if(err){
        console.log(err.message);
        return;
      }
      let originAccounts = JSON.parse(data.toString('utf8'));
      originAccounts.forEach((account, index) => {
        if(account.phone === tel){
          originAccounts.splice(index, 1);
        }
      })
      fs.writeFile(path.resolve(__dirname, filepath),JSON.stringify(originAccounts, null, 4), function(err) {
        if(err){
          console.log(err.message);
          return;
        }
      })
    })
  }

  static getProcessLoggerName() {
    let ret = []
    processManager.all_child_process.forEach(item => {
      ret.push({
        pid: item.pid,
        path: item.path
      })
    })
    return ret;
  }

  static listenMsg(msg) {
    console.log('msg from sub child', msg);
    // 接受到子进程消息
    if(msg === 'CLOSEALL'){
      processManager.closeAllChild();
    }

    if(msg.code === "buy_done"){
      processManager.reWriteFiles(msg.tel, msg.filepath);
    }
    if(msg.code === "startBuy"){
      console.log('开始购买', msg);
      // 开启进程进行购买
      let len = msg.totals > msg.accounts.length ? msg.accounts.length:msg.totals;
      processManager.closeAllChild();
      for(let i = 0 ; i < len ; i++){
        let child = fork(
          path.resolve(__dirname, '../controllers/buyFixed.js'),
          [msg.currentShopId,JSON.stringify(msg.accounts[i]), msg.limitCount, msg.filepath]
        )
        child.on('message', processManager.listenMsg);
        child.on('exit', function(code){
          console.log('完成一单'+code);
          processManager.buying_process.forEach((child_pid, index) => {
            if(child_pid === child.pid){
              processManager.buying_process.splice(index, 1);
            }
          })
          if(processManager.buying_process.length === 0){
            console.log('全部结束，5秒后开始重新监听对应事件');
            setTimeout(() => {
                processManager.startAllProcess();
            }, 5000)

          }
        })
        processManager.buying_process.push(child.pid);
      }
    }
  }
}

// 定义静态变量
processManager.all_child_process = [];
processManager.buying_process = [];

// process.on('exit', (code)=>{
//   console.log(`即将退出，退出码：${code}`);
//   console.log('主进程退出，杀掉子进程');
//   processManager.closeAllChild();
//   processManager.all_child_process = [];
// })
console.log(process.channel);


// {
//   code:"startBuy",
//   currentShopId: currentShopId,
//   stock: _stock,
//   totals: totals,
//   limitCount: _limitCount
// }

module.exports = processManager;
