const {fork} = require('child_process');
const path = require('path');
/**
 * 监控进行
 * 接受用户请求
 * 开启一个新的进程进行监控
 */
class watchController {

  /**
   * success - 返回成功json
   *
   * @param  {type} res  description
   * @param  {type} data description
   * @return {type}      description
   */
  successResponse(res, data) {
    return res.json({
      status: 200,
      data: data
    })
  }


  /**
   * failResponse - 返回失败的json
   *
   * @param  {type} res   description
   * @param  {type} error description
   * @return {type}       description
   */
  failResponse(res, error){
    return res.json({
      status: 500,
      error: error.msg
    })
  }

  getAccountsArray(accounts) {
    let _accounts = accounts.split("|");
    let ret = [];
    _accounts.forEach(item => {
      ret.push('../accounts/' + item);
    });
    return ret;
  }
  /**
   * 开始监控
   *
   * @param  {type} req  description
   * @param  {type} res  description
   * @param  {type} next description
   * @return {type}      description
   */
  startWatch(req, res, next){
    let accounts = req.query.accounts;
    let accountsArray = this.getAccountsArray(accounts);
    let child_process_ids = [];
    accountsArray.forEach((accountPath) => {
      processManager.all_child_process.forEach((_process, index) => {
        if(_process.path === accountPath){
          console.log('进程被杀死', _process.pid);
          _process.child.kill();
          processManager.all_child_process.splice(index, 1);
        }
      })
      let child_process = fork(path.resolve(__dirname, "../script/watchMulti.js"), [accountPath]);

      child_process_ids.push({
        pid: child_process.pid,
        path: accountPath
      });
      processManager.all_child_process.push({
        pid: child_process.pid,
        path: accountPath,
        child: child_process
      });

      child_process.send({status: 'UPDATELOGGER', all_child_process: processManager.getProcessLoggerName()});
      child_process.on('message', processManager.listenMsg)
    })

    this.successResponse(res, {
      msg:"ok",
      child_process_data: child_process_ids
    })
  }
}

module.exports = watchController;
