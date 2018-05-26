/**
 * 配置文件
 * 数据库配置
 */

module.exports = {
	db:{
		host:"127.0.0.1",
		user:"db_bms_english4",
		password:"bmsroot",
		database: "db_bms_english4",
		multipleStatements:true,
		dateStrings:true
	},
	tcpserver:{
		port:60026,
		exclusive:true
	},
	httpserver:{
		port:3000
	},
	com: {
		name:'COM1',
		baudRate: 9600,  //波特率
		dataBits: 8,    //数据位
		parity: 'none',   //奇偶校验
		stopBits: 1,   //停止位
		flowControl: false,
		autoOpen: true
	}
};
