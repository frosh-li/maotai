
var current_SelectedLocation = null;
var __phoneCode = null;

$(function () {

    SwitchLayer("main");

    initPage();
    initButtenEvents();

});

function initPage() {
    onHashChangeEvent();
    Ajax_GetAddress();
    $(window).on("hashchange", onHashChangeEvent);
    __map_autocomplete = new AMap.Autocomplete({ city: "" });

}

function initButtenEvents() {

    $("#but_Location").click(onShowLocationLayerEvent);
    $("#but_cancelLocation").on("click", onCancelLocationEvent);
    $("#but_saveAddress").on("click", onSaveAddressEvent);
    $("#input_tel").inputRule(/^1\d{0,10}$/);
    $("#input_PhoneCode").inputRule(/^\d{0,6}$/);
    $("#input_LocationAddress").on("input", onInputLocationAddressEvent);
}


function onHashChangeEvent() {
    var hash = location.hash;
    if (hash) {
        hash = hash.replace(/#/, '');
        SwitchLayer(hash);
    } else {
        SwitchLayer("main");
    }
}


function onShowLocationLayerEvent() {
    location.hash = "#location";
}

function onCancelLocationEvent(){
    location.hash = "";
}

function onSaveAddressEvent(){

    Ajax_SaveAddress();
}


//定位地址关键字输入事件
function onInputLocationAddressEvent() {

    var oldval = $.trim($(this).data("__oldValue"));
    var value = $.trim($(this).val());
    if (oldval == value) { return; }

    __map_autocomplete.search(value, function (status, result) {

        if (result.info != "OK") { return; }
        RenderLocationAddresss(result.tips);
    });

  
}
function RenderLocationAddresss(tips) {

    var $list = $("#list_locationTips").empty();
    $.each(tips, function (i, n) {

        if (!n.id || !n.location) { return; }

        var name = n.name;
        var position = n.district + n.address + "附近";
        var itemHtml = '' +
        '<li>' +
            '<a class="list-item">' +
                '<label>' + name + '</label>' +
                '<span>' + position + '</span>' +
            '</a>' +
        '</li>';

        var $item = $(itemHtml).data("__itemObj", n).click(onSelectedLocationAddressEvent);
        $list.append($item);

    });
}



//选中定位到的地址事件
function onSelectedLocationAddressEvent() {

    var obj= $(this).data("__itemObj");

    var text = obj.name;
  
    $("#text_District").text(obj.district);
    $("#but_Location").text(obj.name);
    current_SelectedLocation = obj;
    location.hash = "";
}


function SwitchLayer(layerName) {
    $(".view-layer").hide();
    $("#view_" + layerName).show();
}






function CheckParams() {
    var name = $.trim($("#input_name").val());
    var tel = $.trim($("#input_tel").val());

    var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,5}$/;
 

    if (!name) {
        $.dialog.toast("请填写收货人姓名");
        return false;
    }

    if (!reg.test(name)) {
        $.dialog.toast("收货人姓名只能输入中文，英文字母或数字，且必须2到5个字符");
        return false;
    }
    if (!tel) {
        $.dialog.toast("请填写收货手机号码");
        return false;
    }
    if (tel.length != 11) {
        $.dialog.toast("请填写正确的收货手机号码");
        return false;
    }
    if (current_SelectedLocation == null) {
        $.dialog.toast("请选择定位地址");
        return false;
    }
 
    return true;
}

function GetParams() {

    if (!CheckParams()) { return null; }
    var loc_obj = current_SelectedLocation;
    var loc_lon = loc_obj.location.lng;
    var loc_lat = loc_obj.location.lat;

    var LinkName = $.trim($("#input_name").val());
    var linkTel = $.trim($("#input_tel").val());
    var houseNumber = $.trim($("#input_houseNumber").val());
    var isDefault = $("#input_isDefault").prop('checked');


    return {
        action: "AddressManager.edit",
        phoneCode: __phoneCode,
        sId:$.getParam("addressNo"),
        provinceId: loc_obj.adcode.substr(0, 2) + "0000",   //省分编码
        cityId: loc_obj.adcode.substr(0, 4) + "00",         //城市编码
        districtsId: loc_obj.adcode,                        //地区编码
        addressInfo: loc_obj.district,
        address: loc_obj.name + ',' + houseNumber,          //详细地址
        shipTo: LinkName,
        callPhone: linkTel,
        zipcode: '000000',
        isDef: isDefault ? 1 : 0,
        lng: loc_lon,
        lat: loc_lat,
    };


}


function Ajax_SaveAddress(callback) {
    var source = $.getParam("source");
    var type = $.getParam("type");
    var skip = $.getParam("skip"); //"&skip=noDate"
    var yxy = $.getParam("yxy");

    var params = GetParams();
    if (params == null) { return; }

    if (source == 1 && yxy) { params.SMNo = StorageGet("Yxy_SMNo"); }
    else if (source == 2 || source == 3) { params.relPhone = StorageGet("relPhone"); }

    var fun = (typeof (callback) == "function" ? callback : function (tel) { ShowVerifyReceivePhone(tel); });

    AjaxGet(getDotNetServer() + "/API/Servers.ashx?", params, function (response) {
        if (!response.state) { $.dialog.toast(response.msg); return; }
        if (response.code == 11) { fun(response.data.TelPhone); return; }
        if (response.code != 0) { $.dialog.toast(response.msg); return; }



        var str = StorageGet("selectAddress");
        var no = str.split("||")[0];
        if (no == $.getParam("addressNo")) {

            //35732||tydd||12222255454||贵州省 贵阳市 花溪区||520111
            var addstr = no + "||" + params.shipTo + "||" + params.callPhone + "||" + params.addressInfo + "||" + params.districtsId;;
            StorageSet("selectAddress", addstr);
            StorageSet("invoiceSeclectd", "");
            StorageSet("buyinquiry_cupconStr", "");
            StorageSet("invoiceType", "");
            StorageSet("CouponsId", "");
            StorageSet("invoicePost", "");
        }
        $.dialog.toast("修改收货地址成功");

        setTimeout(function () {
            if (type == "Reservations") { skipAppointedPage("../../Reservations/SelectAddress.html"); return; }
            if (type == "select") {
                if (source == 1) {
                    skipAppointedPage("../../yunweishang/YhOrder/selectAddress.html");
                } else if (source == 2) {
                    skipAppointedPage("../../PersonalCenter/Shhyx/selectAddress.html");
                } else if (source == 3) {
                    skipAppointedPage("../../yunweishang/Shhyx/selectAddress.html");
                } else {
                    skipAppointedPage("../../BuyInquiry/selectAddress.html");
                }

            } else {
                skipAppointedPage("MyAddress.html");
            }
        }, 1000);

    }, "", true);
}


function Ajax_GetAddress() {
    var source = $.getParam("source");
    var type = $.getParam("type");
    var yxy = $.getParam("yxy");

    if (source == 2 || source == 3) {
        var params = {
            action: "AddressManager.info",
            SId: $.getParam("addressNo"),
            relPhone: StorageGet("relPhone")
        };
    } else if (source == 1 && yxy) {
        var params = {
            action: "AddressManager.info",
            SId: $.getParam("addressNo"),
            SMNo: StorageGet("Yxy_SMNo")
        };
    } else {
        var params = {
            action: "AddressManager.info",
            SId: $.getParam("addressNo")
        };
    }
    AjaxGet(getDotNetServer() + "/YSApp_API/YSAppServer.ashx?", params, function (response) {
        if (response.state == true) {
            RenderAddressInfo(response.data);
        } else {
            $.dialog.toast(response.msg);
        }
    });
}


function RenderAddressInfo(obj) {


    $("#input_name").val(obj.ShipTo);
    $("#input_tel").val(obj.TelPhone);
    $("#input_isDefault").prop('checked', obj.IsDefault);
    $("#text_District").text(obj.AddressInfo);
    $("#but_Location").text(obj.Address.split(',')[0]);
    $("#input_houseNumber").val(obj.Address.split(',')[1]);

    current_SelectedLocation = {
        "name": obj.Address.split(',')[0],
        "district": obj.AddressInfo,
        "adcode": obj.DistrictsId,
        "location": { lng: obj.Longitude, lat: obj.Latitude }
    };


}




function Ajax_SendPhoneCode(telPhone, callback) {

    var fun = typeof (callback) == "function" ? callback : function () { };
    var params = {
        action: "AddressManager.sendCode",
        tel: telPhone
    };

    AjaxGet(getDotNetServer() + "/API/Servers.ashx?", params, function (response) {

        if (!response.state) { fun(false); return; }
        if (response.code == 0) { fun(true); return; }
        fun(false);

    }, true);


}

var __IsStartTimer = false;

function ShowVerifyReceivePhone(tel) {


    function __SendPhoneCode__() {

        if (__IsStartTimer) { return; }
        $("#but_SendPhoneCode").text("正在发送...").attr("enable", "false");
        Ajax_SendPhoneCode(tel, function (result) {
            var tick = 120;
            $.startTimer(function () {
                __IsStartTimer = tick > 0;

                var text = __IsStartTimer ? "重新发送(" + (tick--) + ")" : "重新发送";
                $("#but_SendPhoneCode").text(text).attr("enable", !__IsStartTimer);

                return __IsStartTimer;
            }, true);
        });
    }


    $("#lable_PhoneCodeTip").text("为确保商品派送无误，我们将验证您的收货手机号，验证码已发送至手机" + tel + "(收货手机号)");
    $("#view_VerifyReceivePhone").show();


    $("#but_SendPhoneCode").on("click", function () {
        var isEnable = $(this).attr("enable") != "false";
        if (!isEnable) { return; }
        __SendPhoneCode__();
    });

    $("#but_submitVerify").on("click", function () {
        __phoneCode = $("#input_PhoneCode").val();
        if (__phoneCode.length != 6) { $.dialog.toast("请输入正确的验证码"); return; }
        Ajax_SaveAddress(function (tel) {
            $.dialog.toast("验证码输入错误");
        });

    });


    $("#but_cancelVerify").on("click", function () {

        $("#but_SendPhoneCode").off("click");
        $("#but_submitVerify").off("click");
        $("#but_cancelVerify").off("click");
        $("#view_VerifyReceivePhone").hide();
    });
    __SendPhoneCode__();


}


function CloseVerifyReceivePhone() {
    $("#view_VerifyReceivePhone").hide();

}
