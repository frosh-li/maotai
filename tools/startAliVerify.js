const {
    execSync,
    exec
} = require('child_process');
const getPixels = require('get-pixels');
const path = require('path');

//const adb = "/Users/bigdata/Library/Android/sdk/platform-tools/adb -s emulator-5554";

function avg(arr){
  let totals = 0;
  arr.forEach(item => {
    totals+=item;
  })
  return totals/arr.length;
}
class AliVerify {

    constructor(devicename) {
      
      this.screen = devicename;
      this.adb = "adb -s "+ devicename;
      
    }
    clearOldToken() {
      global.aliSessionId = "";
    }
    /**
     * swipeToCircle - 移动到圈圈内
     *
     * @return {type}  description
     */
    swipeToCircle(sPoint, ePoint) {
            let pressX = sPoint[0];
            let pressY = sPoint[1];
            let pressX1 = ePoint[0];
            let pressY1 = ePoint[1];
            let dur = 500;
            let adbCommand = `${this.adb} shell input swipe ${pressX} ${pressY} ${pressX1} ${pressY1} ${dur}`;

            exec(adbCommand, (err) => {
              if(err){
                return console.log(err);
              }
            });
        }
        /**
         * capture - 截屏
         *
         * @return {type}  description
         */
    capture() {
            // console.log('屏幕截图开始',`adb shell /system/bin/screencap -p /sdcard/screenshot.png`);
            return new Promise((resolve, reject) => {
              let command = `${this.adb} shell /system/bin/screencap -p /sdcard/${this.screen}.png`;
              console.log(command);
              require('child_process').exec(command, (err) => {
                if(err){
                  return reject(err);
                }
                // console.log('屏幕截图完成')
                // console.log('拉取屏幕截图到电脑','adb pull /sdcard/screenshot.png /Users/junliang/server/www/maotaiServer/temp/');
                command = `${this.adb} pull /sdcard/${this.screen}.png ./temp/`
                console.log(command);
                require('child_process').exec(command, (err) => {
                  if(err){
                    return reject(err);
                  }
                  return resolve(true);
                });
              });  
            })
            
            
            // console.log('拉取完成');
        }
        /**
         * openAliUI - 远程打开阿里验证UI
         *
         * @return {type}  description
         */
    openAliUI() {
        console.log('start to open ali ui')
        let pressX = 126;
        let pressY = 98;
        let dur = 10;
        let adbCommand = `${this.adb} shell input tap ${pressX} ${pressY}`;
        console.log(adbCommand);
        exec(adbCommand, (err) => {
          if(err){
            return console.log(err);
          }
        });
    }

    calcPos(callback) {
        let sPoint = [0, 0],
            ePoint = [0, 0];
        let startPointX = [];
        let startPointY = [];
        let endPointX = [];
        let endPointY = [];
        let getPixTime = (+new Date());
        getPixels(path.resolve(__dirname, `../temp/${this.screen}.png`), (err, pixels) => {
            console.log('获取图像耗时', (+new Date() - getPixTime) + "ms");
            if (err) {
                console.log(err);
                callback([sPoint, ePoint]);
            }
            let width = pixels.shape[0];
            let height = pixels.shape[1];
            console.log('image size', width, height);
            let startTime = +new Date();
            for (let i = 0; i < width; i = i + 4) {
                for (let j = height / 3; j < height; j = j + 4) {
                    let R = pixels.get(i, j, 0),
                        G = pixels.get(i, j, 1),
                        B = pixels.get(i, j, 2);
                    if (R == 235 && G == 2 && B == 41) {
                        // start pos;
                        sPoint = [i, j];
                        startPointX.push(i);
                        startPointY.push(j);
                    }
                    if (R == 46 && G == 171 && B == 255) {
                        // end pos
                        ePoint = [i , j]
                        endPointX.push(i);
                        endPointY.push(j);
                    }
                }
            }
            console.log(sPoint, ePoint, (+new Date() - startTime) + "ms");
            if(
              startPointX.length > 0
              &&
              startPointY.length > 0
              &&
              endPointX.length > 0
              &&
              endPointY.length > 0
            ){
              sPoint = [avg(startPointX), avg(startPointY)]
              ePoint = [avg(endPointX), avg(endPointY)]
            }
            callback([sPoint, ePoint]);
        })
    }


    /**
     * connectSidFromHard - 从硬件设备获取SID
     *
     * @return {type}  description
     */
    connectSidFromHard(devicename) {
        
        // return new Promise((resolve, reject) => {
            this.openAliUI();
            return this.captureAndCalcPos();
        // })

    }


    /**
     * captureAndCalcPos - 重新截屏
     * 防止截屏的时候并没有加载完成阿里组件的情况
     *
     * @return {type}  description
     */
    captureAndCalcPos() {
        // 开始截屏
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.capture()
                  .then((opened) => {
                    this.calcPos(Points => {
                        if (
                            Points[0][0] == 0 ||
                            Points[0][1] == 0 ||
                            Points[1][0] == 0 ||
                            Points[1][1] == 0
                        ) {
                            console.log('restart to find image');
                            this.captureAndCalcPos();
                        }else{
                          this.swipeToCircle(Points[0], Points[1]);
                          return resolve(true);  
                        }
                        
                    });
                  }).catch(e => {
                    this.captureAndCalcPos();
                  });
                  
            }, 1000);  
        })
    }
}

module.exports = AliVerify;
