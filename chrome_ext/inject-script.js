function autoSlide() {
		var cindex = document.getElementById("dom_id").getAttribute('data-nc-idx');
    var ele = document.getElementById("nc_"+cindex+"_n1z");
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
            var customEvent = document.createEvent('Event');
            customEvent.initEvent('slideDone', true, true);
            document.dispatchEvent(customEvent);
            return;
        }
        e = document.createEvent('MouseEvents');
        e.initMouseEvent("mousemove", true, false, null, 0,0,0,start,Math.random()*2,false,false,false,false, 0, null);
        ele.dispatchEvent(e);
        start = start+Math.random()*20;
    }, 15); 
}


function initAli() {
    var nc = new noCaptcha();
    var nc_appkey = 'FFFF00000000016A8646';  // 应用标识,不可更改
    var nc_scene = 'login';  //场景,不可更改
    var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
    var nc_option = {
        renderTo: '#dom_id',//渲染到该DOM ID指定的Div位置
        appkey: nc_appkey,
        scene: nc_scene,
        token: nc_token,
        //trans: '{"name1":"code100"}',//测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
        callback: function (data) {// 校验成功回调
            console.log(data);
            console.log(data.csessionid);
            console.log(data.sig);
            console.log(nc_token);
            $.post("http://127.0.0.1:7001/api/token",data, function(){
            	
            }).complete(function(){
            		setTimeout(() => {
		                initAli();
		                setTimeout(() => {
		                    autoSlide();    
		                }, 1000);
		                
	            }, 5000);	
            })
            
        }
    };
    nc.init(nc_option);
}

initAli();
setTimeout(() => {
	console.log('start to slider');
	autoSlide();
},2000)
/*
window.addEventListener("message", function(e) {
		console.log(e.data);
		if(e.data.cmd === 'SLIDE_DONE'){
			initAli();
		}
}, false);
*/