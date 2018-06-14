思路简单记录

1、添加或者修改地址功能
2、下单预约功能
2、锁定购买功能


//0全部订单，status=1待付款，status=3-待收货，status=5-订单完成
status=1待付款，status=3-待收货，status=5-订单完成
status 4 = 关闭订单
1、待付款
5、订单结束
4、订单关闭
3、待收货


  破解相关

  https://webapi.amap.com/maps?v=1.4.0&plugin=AMap.Autocomplete&key=462f27e00614a30baa9ed1864455213f&hashtag=a36979f1818e475cb1e78af0d44cd38b



// 账号绑定

sid 162620124001
action  UserManager.RecoBind
timestamp121  1523348416683

{
  "state": true,
  "code": 0,
  "msg": "绑定成功"
}


// 发送验证码
curl -H 'Host: www.cmaotai.com' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Origin: https://www.cmaotai.com' -H 'X-Requested-With: XMLHttpRequest' -H 'User-Agent: Mozilla/5.0 (Linux; Android 4.4.4; MuMu Build/V417IR) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[android/1.0.23/266f81996392df0ef56257c0f894a6f2/a834acfceda69ec690b4142e0082456f]' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Referer: https://www.cmaotai.com/ysh5/page/LoginRegistr/userRegistr1.html' -H 'Accept-Language: zh-CN,en-US;q=0.8' -H 'Cookie: acw_tc=AQAAAKGyBR+eAAUA7RIV31XDcx0WA0tb; ASP.NET_SessionId=sjmab3ujxa4ejq2g2epg15w5; Hm_lvt_8b83f87d060d93d589c9a2c17dde6656=1523091705; Hm_lpvt_8b83f87d060d93d589c9a2c17dde6656=1523348223; SERVERID=73717107c680adffd3c04c75b05bf592|1523348250|1523326256' --data-binary "tel=13002629407&sessid=nc1-01W8fUo7tiNBKrkhR8ACXXKRu8MwhWjOJthfte5BNvahy6dVF80TktVhexEcmFEz9Um-sTtpWZiubQ2qcBTOIznQ-nc2-0561M3bob-R8gv1KNXk15v5bkS76NYlEyqbuKhC0ArCxeGEttHouIyva3qgLM576JmpElSacazF6WXh222UB1MOPnjEoMzcAQCQaXyHobfuzwNnquTqdNMDQPgrgjjUBaUse8HH7Rt6xf8uI2S7O9yw3bau4a0Zxm6bGQk-zLc0VYTjBaLkbBYTd_ecUVZntpKaSFP0K-ZcYeVB367lCZ56obc6G0ESpzsjtycEVftZVyHPg2lpXXB1UmcN-ESmIPt7gN36HZHKZgHITf7oZvlfXKkiPFu0AGcDntK6wW4yV6_sf51rgtuoLir78Tpzl1ehC_pg32qUWogeeuKbouvTl7RIhYE9I2tl5vQV_faNIDK5uYQEqmzuOWLJDNObZvlDbG98a3J7KB92l8OebuxIf1DHF1eOEduaMOl4kp46PV1tsMxw7ekzijo062D4MLOWheICCAFERpY6LyS8j3iSg-nc3-01YGjVYP56xB8j7o4jZfyVfxRE4La9d1ioTGPjtgu7qcmAWrQ7Ac5gB2TjX65JloHi0zS7Ckb-VX8MSzthisjhYlKvxHPiLdG8wWhSsejxVKOyZxqe4dqxcjsTMISyn0mTZE1FSCBc4zSVRKWwotb629aQEVn7ikm7TMTYnShy4sQ-nc4-FFFFA0000000016A858A&imgCode=&timestamp121=1523348280039" --compressed 'https://www.cmaotai.com/API/SendRegCode.ashx'


// 验证码验证
curl -H 'Host: www.cmaotai.com' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Origin: https://www.cmaotai.com' -H 'X-Requested-With: XMLHttpRequest' -H 'User-Agent: Mozilla/5.0 (Linux; Android 4.4.4; MuMu Build/V417IR) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[android/1.0.23/266f81996392df0ef56257c0f894a6f2/a834acfceda69ec690b4142e0082456f]' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Referer: https://www.cmaotai.com/ysh5/page/LoginRegistr/userRegistr1.html' -H 'Accept-Language: zh-CN,en-US;q=0.8' -H 'Cookie: acw_tc=AQAAAKGyBR+eAAUA7RIV31XDcx0WA0tb; ASP.NET_SessionId=sjmab3ujxa4ejq2g2epg15w5; Hm_lvt_8b83f87d060d93d589c9a2c17dde6656=1523091705; Hm_lpvt_8b83f87d060d93d589c9a2c17dde6656=1523348223; SERVERID=73717107c680adffd3c04c75b05bf592|1523348280|1523326256' --data-binary "action=UserManager.CheckRegCode&tel=13002629407&telCode=620211&timestamp121=1523348377398" --compressed 'https://www.cmaotai.com/API/Servers.ashx'



// 注册
curl -H 'Host: www.cmaotai.com' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Origin: https://www.cmaotai.com' -H 'X-Requested-With: XMLHttpRequest' -H 'User-Agent: Mozilla/5.0 (Linux; Android 4.4.4; MuMu Build/V417IR) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[android/1.0.23/266f81996392df0ef56257c0f894a6f2/a834acfceda69ec690b4142e0082456f]' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Referer: https://www.cmaotai.com/ysh5/page/LoginRegistr/userRegistr2.html' -H 'Accept-Language: zh-CN,en-US;q=0.8' -H 'Cookie: acw_tc=AQAAAKGyBR+eAAUA7RIV31XDcx0WA0tb; ASP.NET_SessionId=sjmab3ujxa4ejq2g2epg15w5; Hm_lvt_8b83f87d060d93d589c9a2c17dde6656=1523091705; Hm_lpvt_8b83f87d060d93d589c9a2c17dde6656=1523348223; SERVERID=73717107c680adffd3c04c75b05bf592|1523348378|1523326256' --data-binary "action=UserManager.CheckRegCode&tel=13002629407&telCode=620211&timestamp121=1523348386460&pwd=qwer1234" --compressed 'https://www.cmaotai.com/API/RegMember.ashx'






13411447532
13002629407


// 获取验证码

http://api.tay8.com/msgcode/api/do.php?action=getMessage&sid=9715&phone=13411447532&&token=F98117E24A354659801400A229B55F4B

// 加入黑名单

http://api.tay8.com/msgcode/api/do.php?action=addBlacklist&sid=9715&phone=17068270488&token=F98117E24A354659801400A229B55F4B

// 获取手机号

http://api.tay8.com/msgcode/api/do.php?action=getPhone&sid=9715&token=F98117E24A354659801400A229B55F4B&vno=0&phoneType=CMCC

phoneType=CMCC，CMCC是指移动，UNICOM是指联通，TELECOM是指电信


// 登录

http://api.tay8.com/msgcode/api/do.php?action=loginIn&name=lijunliang&password=qwer1234A!

// 释放当前用户下所有手机号
http://api.tay8.com/msgcode/api/do.php?action=cancelAllRecv&token=F98117E24A354659801400A229B55F4B



103.861723,36.053154 甘南路     262620124001

103.863118,36.055655 天水南路   162620100001

103.859394,36.080088 兰州市盐场路上川嘉园 162620124001

103.773789,36.082969 火星街  162620125001



[
  {"phone":"15949806339","pass":"lhj0325","addressId":1935818},
  {"phone":"17097224268","pass":"123456","addressId":1894299},
  {"phone":"18032952504","pass":"123456","addressId":1879695},
  {"phone":"18201603185","pass":"123456","addressId":1884119},
  {"phone":"18207517996","pass":"123456","addressId":1829922},
  {"phone":"18333966217","pass":"123456","addressId":1879800},
  {"phone":"18382394514","pass":"123456","addressId":1840503},
  {"phone":"18629896680","pass":"123456","addressId":""}
]



// 金色条装   402
// 白色条装   401



安徽省合肥市###
（不管你预约什么地址，只要能下到指定的自提点即可）
自提点地址：


合肥市沿河路106号商之都行政楼后3号楼（编码：234340125003）
合肥市庐阳区毫州路世纪家园14幢2单元102室（编码：234340125003）
合肥市蜀山区金寨路311号（编码：234340126001）
合把市临泉中路美晨雅阁西苑108商铺（编码：134340100004）
合肥市宿州路逍遥津西大门北省政斜对面（编码：134340100001）
合肥市蜀山区祁门路333号新地中心3栋3001（编码：234340126002）
合肥市望江西路94号门面（编码：134340100002）


// 117.263017,31.836663  15公里范围内可以全覆盖




#### 活动页面

https://www.cmaotai.com/YsH5/page/Activity/Dealer.html?sid=152520383001

#### 订单详情页面
https://www.cmaotai.com/YsH5/page/Activity/Order.html?c=85996861d6d5460aac6f18ccd53dd08f


### HTML页面的获取阿里验证码

https://diablo.alibaba.com/captcha/click/get.jsonp?sessionid=0152JIZgtMjy7iQLwB8JakWYmbCT-DhqmSbIM_uEaNpCsy4q5IvbDmkkTTuBye7elp5UiC6AxH1jxgsfVMPmsSTCPgmTM7LReHLecaxLu9dd4VzCnE8AM8wEwCH2x536UL5AuSV_hmv2nXACvU3uX_Dw&identity=FFFF00000000016A8646&style=ncc&lang=cn&v=918&callback=jsonp_08377122472037852

#### 网点查询
https://www.cmaotai.com/API/Servers.ashx?action=StatisticsManager.SearchNetwork&prov=350000&timestamp121=1524637948785


江苏省苏州市干将东路780号
江苏省苏州市吴江区松陵镇高新路910号
江苏省苏州市吴中区木渎镇香榭假日山庄商铺4幢2号
江苏省苏州市葑门路12号
江苏省苏州市高新区塔圆路131号
江苏省苏州市工业园区娄葑分区东兴路58号  特约经销商
江苏省苏州市常熟市枫林路99号



https://www.emaotai.cn/SubmmitOrder.aspx?productId=9&sigUpProductBuy=3&qty=2

productId: 9
sigUpProductBuy: 3
qty: 2



__VIEWSTATE: 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AgsPFgIfAWVkAgwPFQEBMmQCDQ8PFgIfBygrBAkyOTk4LjAwMDBkZAIPDw8WBB4LTmF2aWdhdGVVcmwFFy9GYXZvdXJhYmxlL3Nob3ctMC5hc3B4HwFlZGQCKw8PFgIfAQUEMC4wMGRkAjUPZBYCZg9kFgRmDw8WAh8AaGQWAgIBDzwrAAkAZAICDw8WAh8AaGQWAgIBDzwrAAkAZAI3DxYCHwBoFgJmD2QWAgIBD2QWAgIBDxAWBh4NRGF0YVRleHRGaWVsZAULRGlzcGxheVRleHQeDkRhdGFWYWx1ZUZpZWxkBQlDbGFpbUNvZGUfAmcQFQEAFQEBMBQrAwFnFCsBAGQCQQ8PFgIfAQUBMGRkAkkPDxYCHwcoKwQJMjk5OC4wMDAwZGQCTw8PFgIfAQUEMjk5OGRkAmMPDxYCHwcoKwQJMjk5OC4wMDAwZGQYAwUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgoFSFN1Ym1taXRPcmRlciRDb21tb25fU2hpcHBpbmdNb2RlTGlzdCRfJGdyZFNoaXBwaW5nTW9kZSRjdGwwMiRyYWRpb0J1dHRvbgVGU3VibW1pdE9yZGVyJGdyZF9Db21tb25fUGF5bWVudE1vZGVMaXN0JF8kZ3JkUGF5bWVudCRjdGwwMiRyYWRpb0J1dHRvbgVGU3VibW1pdE9yZGVyJGdyZF9Db21tb25fUGF5bWVudE1vZGVMaXN0JF8kZ3JkUGF5bWVudCRjdGwwMiRyYWRpb0J1dHRvbgVGU3VibW1pdE9yZGVyJGdyZF9Db21tb25fUGF5bWVudE1vZGVMaXN0JF8kZ3JkUGF5bWVudCRjdGwwMyRyYWRpb0J1dHRvbgVGU3VibW1pdE9yZGVyJGdyZF9Db21tb25fUGF5bWVudE1vZGVMaXN0JF8kZ3JkUGF5bWVudCRjdGwwMyRyYWRpb0J1dHRvbgVGU3VibW1pdE9yZGVyJGdyZF9Db21tb25fUGF5bWVudE1vZGVMaXN0JF8kZ3JkUGF5bWVudCRjdGwwNCRyYWRpb0J1dHRvbgVGU3VibW1pdE9yZGVyJGdyZF9Db21tb25fUGF5bWVudE1vZGVMaXN0JF8kZ3JkUGF5bWVudCRjdGwwNCRyYWRpb0J1dHRvbgVGU3VibW1pdE9yZGVyJGdyZF9Db21tb25fUGF5bWVudE1vZGVMaXN0JF8kZ3JkUGF5bWVudCRjdGwwNSRyYWRpb0J1dHRvbgUVU3VibW1pdE9yZGVyJGNoa0FncmVlBRNTdWJtbWl0T3JkZXIkY2hrVGF4BTRTdWJtbWl0T3JkZXIkZ3JkX0NvbW1vbl9QYXltZW50TW9kZUxpc3QkXyRncmRQYXltZW50DzwrAAwDBhUBB0dhdGV3YXkHFCsABBQrAAEFB2NjYl9wYXkUKwABBQphYmNfcGF5X3BjFCsAAQUHaWNiY19wYxQrAAEFCWFsaXBheV9wYwgCAWQFNlN1Ym1taXRPcmRlciRDb21tb25fU2hpcHBpbmdNb2RlTGlzdCRfJGdyZFNoaXBwaW5nTW9kZQ88KwAMAwYVAQZNb2RlSWQHFCsAARQrAAECDQgCAWQ=
radaddresstype: taobao
SubmmitOrder$txtShipTo: 
ddlRegions1: 
ddlRegions2: 
ddlRegions3: 
regionSelectorValue: 0
regionSelectorNull: -请选择-
SubmmitOrder$txtAddress: 
SubmmitOrder$txtZipcode: 
SubmmitOrder$txtTelPhone: 
SubmmitOrder$txtShippingId: 
SubmmitOrder$txtCellPhone: 15330066919
invoiceRadio: on
shippButton: 13
paymentMode: 5
SubmmitOrder$tbActvityProductID: ,9
SubmmitOrder$tbActiviPrice: ,1499.00
SubmmitOrder$txtMessage: 
SubmmitOrder$chkAgree: on
SubmmitOrder$txtInvoiceTitle: 
SubmmitOrder$csessionid: 0152JIZgtMjy7iQLwB8JakWbrb5TcWsxXiRX_6ztfEpBPXEosKAM9GvtML72mOR_61iFa8VilmakQyEY5oTNwR1NKG-vyig8tpwLgChUhRQksVzCnE8AM8wEwCH2x536UL5AuSV_hmv2nXACvU3uX_Dw
SubmmitOrder$sig: 05a1C7nT4bR5hcbZlAujcdyXquG0EzLazJTxThdXHob4AoJCU-kzEHo75C57Zd6BpKW9y-uwCfK6IQpRjVzjCYI7QVVhnL3TSnCbHKyqQIwYhiGp4-RSlo2wwzH2kqN58cRN_uai2jmcz4rIelm6wQFSoKhnFbXVQ12BWmTIXO446P_0dmpud-2_jXZ099hQ9IzEBW_ZL7XKg_xMO9BNxxTj7mfuDwXEuW0Y1fHAujmqK6Uiz_ne890vgWIIaWmlWRRLU8meK4z9ghkNSWQFnJTPbXV7pBrcGZM5ILdJYZxtNyrvCMj458xyImLt-_HWV2PRkVLWbPjPgc_kP0-Qd1BJiWLu-Jsla6JtyYX9jfZGA-hMjZ1BXfTZUs3vVudF33tCh6E8Cak3yUq9EBQbSSIg
SubmmitOrder$token: FFFF00000000016A8646:1527559548594:0.3596715463901543
SubmmitOrder$scene: other
SubmmitOrder$btnCreateOrder: 确认提交
SubmmitOrder$htmlCouponCode: 
SubmmitOrder$inputPaymentModeId: 5
SubmmitOrder$inputShippingModeId: 13
SubmmitOrder$hdbuytype: 
SubmmitOrder$inputInvoiceId: 790284
productId: 
qty: 
logoFile: 
pingshengFile: 
userLogoFile: 
userPingshengFile: 
dzjNum: 
dzjMinNum: 