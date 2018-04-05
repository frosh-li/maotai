const addressData = require('./address.json.js');
/**
 * 
 * 基础功能库
 */
class Utils {
	constructor() { }
	/**
	 * 根据时间获取一个20180403类型的字符串
	 * @param  {time}
	 * @return {[string]}
	 */
	static dateFormat(time = (new Date())){
		let year = time.getFullYear();
		let month = time.getMonth() + 1;
		let today = time.getDate();

		month = month < 10 ? (0..toString() + month) : month;
		today = today < 10 ? (0..toString() + today) : today;

		return `${year}${month}${today}`;
	}

	/**
	 * 获取某个经纬度原型范围内的随机经纬度
	 * @param  {[type]}		经度
	 * @param  {[type]}		维度
	 * @param  {Number}		距离
	 * @param  {Number}		点个数
	 * @return {[array]}		数组
	 */
	static randomGeo(_lat, _lon, maxdist = 2 , num = 1){
		let ret = [];
		let radiusEarth = 6372.796924; // 地球半径
		maxdist=maxdist/radiusEarth
		
		
		let startlat = _lat * Math.PI / 180;		// 维度 39.989584
		let startlon = _lon * Math.PI / 180; // 经度116.480724
		for(let i = 0 ; i < num ; i ++){
			let rand1 = Math.random();
			let rand2 = Math.random();
			let dist = Math.acos(rand1*(Math.cos(maxdist) - 1) + 1)
			let brg = 2*Math.PI*rand2;
			let lat = Math.asin(Math.sin(startlat)*Math.cos(dist) + Math.cos(startlat)*Math.sin(dist)*Math.cos(brg))
			let lon = startlon + Math.atan2(Math.sin(brg)*Math.sin(dist)*Math.cos(startlat), Math.cos(dist)-Math.sin(startlat)*Math.sin(lat))
			if(lon < - Math.PI){
				lon = lon +2 * Math.PI;
			}else if(lon > Math.PI){
				lon = lon - 2 * Math.PI;
			}
			ret.push({
				lat: (lat/Math.PI*180).toFixed(6),
				lng: (lon/Math.PI*180).toFixed(6)
			})
		}
		return ret;
	}

	static findCityCode(streetCode){
		let ret = "000000";
		addressData.district.forEach(item => {
			// console.log(item, streetCode)
			if(item.areaCode == streetCode){
				console.log(item);
				ret = item.parentCode;
			}
		})
		return ret;
	}

	static findProvinceCode(streetCode){
		let ret = "000000";
		let cityCode = this.findCityCode(streetCode);
		addressData.city.forEach(item => {
			if(item.areaCode == cityCode){
				console.log(item);
				ret = item.parentCode;
			}
		})
		return ret;
	}
}

module.exports = Utils;