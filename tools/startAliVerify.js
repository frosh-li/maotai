const {
    execSync
} = require('child_process');
const getPixels = require('get-pixels');
const path = require('path');

const adb = "/Users/bigdata/Library/Android/sdk/platform-tools/adb -s emulator-5554";
// const adb = "adb -s emulator-5554";
function avg(arr){
  let totals = 0;
  arr.forEach(item => {
    totals+=item;
  })
  return totals/arr.length;
}
class AliVerify {
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
            let adbCommand = `${adb} shell input swipe ${pressX} ${pressY} ${pressX1} ${pressY1} ${dur}`;

            execSync(adbCommand);
        }
        /**
         * capture - 截屏
         *
         * @return {type}  description
         */
    capture() {
            // console.log('屏幕截图开始',`adb shell /system/bin/screencap -p /sdcard/screenshot.png`);
            require('child_process').execSync(`${adb} shell /system/bin/screencap -p /sdcard/screenshot.png`);
            // console.log('屏幕截图完成')
            // console.log('拉取屏幕截图到电脑','adb pull /sdcard/screenshot.png /Users/junliang/server/www/maotaiServer/temp/');
            require('child_process').execSync(`${adb} pull /sdcard/screenshot.png ./temp/`);
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
        let adbCommand = `${adb} shell input tap ${pressX} ${pressY}`;

        execSync(adbCommand);
    }

    calcPos(callback) {
        let sPoint = [0, 0],
            ePoint = [0, 0];
        let startPointX = [];
        let startPointY = [];
        let endPointX = [];
        let endPointY = [];
        let getPixTime = (+new Date());
        getPixels(path.resolve(__dirname, '../temp/screenshot.png'), (err, pixels) => {
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
    connectSidFromHard() {

        return new Promise((resolve, reject) => {
            this.openAliUI();
            //return this.captureAndCalcPos(resolve, reject);
            this.captureAndCalcPos((status) => {
              if(status){
                return resolve(true)
              }else{
                return this.captureAndCalcPos(resolve, reject)
              }
            });
        })

    }


    /**
     * captureAndCalcPos - 重新截屏
     * 防止截屏的时候并没有加载完成阿里组件的情况
     *
     * @return {type}  description
     */
    captureAndCalcPos(resolve, reject) {
        // 开始截屏
        setTimeout(() => {
            this.capture();
            setTimeout(() => {
                this.calcPos(Points => {
                    if (
                        Points[0][0] == 0 ||
                        Points[0][1] == 0 ||
                        Points[1][0] == 0 ||
                        Points[1][1] == 0
                    ) {
                        // 重试进行截屏
                        return resolve(true);
                    }
                    this.swipeToCircle(Points[0], Points[1]);
                    return resolve(true);
                    return reject(new Error('未知错误'));
                });
            }, 100)
        }, 500);
    }
}

module.exports = new AliVerify();
