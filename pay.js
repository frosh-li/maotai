



var payChannel = {
    none:    ["ccbpay", "abcpay", "unionPay", "depay", "alipay", "gzpay", "bocpay"],
    weixing: ["ccbpay", "abcpay", "unionPay", "depay", "bocpay"],
    iphone: ["ccbpay", "abcpay", "unionPay", "depay", "wxpay", "alipay", "applePay", "gzpay", "bocpay"],
    android: ["ccbpay", "abcpay", "unionPay", "depay", "wxpay", "alipay", "androidPay", "gzpay", "bocpay"]
};

var actionRegion = {
    "520000": "#androidPay_action,#applePay_action",
}


$(function () {
    orderInfoShow(); //展示订单信息
    CheckClient();
    CheckActionRegion();

    checkInfo();
});

function checkInfo() {
    //检查订单信息是否存在
    var oid = urlVaule_key("OrderId");
    if (!oid) {
        $('.tis_title').html('获取订单信息失败！');
        $('.amount-info').hide();
        $('#orderTime').html('您可以前往“我的”-“待付款”订单查看订单信息并完成支付。');
        $('.pay_info').hide();
    }
}

//检查客户端
function CheckClient() {
    $app.getVersion(function(app){
    
        
        var channel = payChannel[app.client];
        if (channel) {
            $.each(channel, function (i, n) {
                $("#" + n).show();
            });
        }
    

        $app.showVersion("applePay", "iphone", "1.0.16");
        $app.showVersion("androidPay", "android", "1.0.16");
    
    });



   


}


function CheckActionRegion() {
    var currAddress = $Storage.get("local_address");
    if (!currAddress) { return; }
    var target = actionRegion[currAddress.ProvCode];
    if (!target) { return; }
    $(target).show();
}

/**
 * 展示订单信息
 */
function orderInfoShow() {
	$("#orderNo").text(urlVaule_key("OrderId")); //订单编号
   //检测条形码
//	checkCode(urlVaule_key("OrderId"));
	var price = parseFloat(urlVaule_key("OrderPayMoney"));
	price = fmoney(price, 2).toString(); //金额格式化
	$("#order_amount").text(price.split(".")[0]); //订单价格 整数
	$("#order_amountDot").text(price.split(".")[1]); //订单价格 小数
	$("#time").text(urlVaule_key("time"));
	
}



function inApp() {
  

    return /YS_App/i.test(navigator.userAgent);
}
/**
 * 检查是否需要条形码
 * @param {Object} oid
 */
function checkCode(oid) {
	var params = {
		action: "OrderManager.orderStatus",
		oid: oid
	}
	AjaxGet(getDotNetServer() + "API/Servers.ashx?", params, function(data) {
		if(data.state == true) {
			data = data.data;
			if(data.code) {
				if(data.payStatus == 0) {
					if(data.orderStatus == 1 || data.orderStatus == 4) {
						var src = getDotNetServer() + "api/BarCode.ashx?text=" + data.oid + "&h=70&bw=2";
						$("#txma").attr("src", src);
						$("#checkCode").text(data.code);
						$("#txBox").show();
					}
				} else if (data.payStatus == 1 && data.ShopId == '252520188011') {
				    var actCode = urlVaule_key("c");
				    window.location.href = '../Activity/product.html?paystatus=1&c=' + actCode;
				}
			}
		} else {
			popupMessage("提示", data.msg, "info");
		}
	}, function() {}, true);
}

/**
 * 查看订单
 */
function gotoOrderDeatils() {
	skipAppointedPage("../PersonalCenter/Order/orderDetails.html?OrderId=" + urlVaule_key("OrderId"));
}

/**
 * 跳转支付
 */
function gotoPayment(OrderId, status) {

	if(status == 10) {
		skipAppointedPage('largePay.html?orderId=' + OrderId);
	} else if(status == 1) {
		skipAppointedPage(getDotNetServer() + 'newpay/OrderPay.aspx?hasTitle=0&orderId=' + OrderId + '&status=' + status);
	} else {
		skipAppointedPage(getDotNetServer() + 'newpay/OrderPay.aspx?hasTitle=1&orderId=' + OrderId + '&status=' + status);
	}
}

/**
 * 在线pos支付
 * To：张成海修改
 * 1-支付宝，2-微信支付，3-在线pos，10-大额支付
 */
function gotoPayNext(PayId) {
	if(PayId != "") {
		var params = {
			action: "OrdersManager.updataOrderPayment",
			status: PayId,
			orderId: urlVaule_key("OrderId")
		}
		AjaxGet(getDotNetServer() + "YSApp_API/YSAppServer.ashx?", params, function(data) {
			hideLoading();
			var code = data.code;
			if(code == 0) { //0代表成功
				var OrderId = urlVaule_key("OrderId");
				var status = PayId;
				gotoPayment(OrderId, status); //去支付
			} else {
				var msg = data.msg;
				popupMessage("提示：", msg, "error");
			}
		}, function() {
			hideLoading();
		});
	}
}
//修改
function gotoPay(PayId) {
    gotoPayNext(PayId);
}
/* * 在线pos支付
 * To：张成海修改
 * 1-支付宝，2-微信支付，3-在线pos，10-大额支付
 */
function gotoPayNext(PayId) {
	if(PayId != "") {
		var params = {
			action: "OrdersManager.updataOrderPayment",
			status: PayId,
			orderId: urlVaule_key("OrderId")
		}
		AjaxGet(getDotNetServer() + "YSApp_API/YSAppServer.ashx?", params, function(data) {
			var code = data.code;
			if(code == 0) { //0代表成功
				var OrderId = urlVaule_key("OrderId");
				var status = PayId;
				gotoPayment(OrderId, status); //去支付
			} else {
				var msg = data.msg;
				popupMessage("提示：", msg, "error");
			}
		}, function() {

		});
	}
}
