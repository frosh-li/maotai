


function autoSlide() {
    var ele = document.getElementById("nc_1_n1z");
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent("mousedown", true, false, null, 0,0,0,0,0,false,false,false,false, 0, null);
    ele.dispatchEvent(e);
    var start = 0;
    var cinter = setInterval(function(){
        if(start >= 300){
            clearInterval(cinter);
            e = document.createEvent('MouseEvents');
            e.initMouseEvent("mouseup", true, false, null, 0,0,0,start,Math.random()*10,false,false,false,false, 0, null);
            ele.dispatchEvent(e);
            window.postMessage({cmd:"SLIDE_DONE"}, "*");
            injectCustomJs();
            return;
        }
        e = document.createEvent('MouseEvents');
        e.initMouseEvent("mousemove", true, false, null, 0,0,0,start,Math.random()*2,false,false,false,false, 0, null);
        ele.dispatchEvent(e);
        start = start+Math.random()*20;
    }, 15); 
}

// 向页面注入JS
function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'inject-script.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}

document.addEventListener('DOMContentLoaded', function()
{
    setTimeout(() => {
        autoSlide();
    },5000);
   
});