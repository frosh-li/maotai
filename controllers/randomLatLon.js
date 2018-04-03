

// 随机生成一定的点的经纬度坐标

module.exports = function(lat, lon, maxdist = 2 , num = 1){
	let ret = [];
	let radiusEarth = 6372.796924; // 地球半径
	maxdist=maxdist/radiusEarth
	let dist = Math.acos(rand1*(Math.cos(maxdist) - 1) + 1)
	let brg = 2*Math.PI*rand2;
	let startlat = _lat * Math.PI / 180;		// 维度 39.989584
	let startlon = _lon * Math.PI / 180; // 经度116.480724
	for(let i = 0 ; i < num ; i ++){
		let rand1 = Math.random();
		let rand2 = Math.random();
		let lat = Math.asin(Math.sin(startlat)*Math.cos(dist) + Math.cos(startlat)*Math.sin(dist)*Math.cos(brg))
		let  = startlon + Math.atan2(Math.sin(brg)*Math.sin(dist)*Math.cos(startlat), Math.cos(dist)-Math.sin(startlat)*Math.sin(lat))
		if(lon < - Math.PI){
			lon = lon +2 * Math.PI;
		}else if(lon > Math.PI){
			lon = lon - 2 * Math.PI;
		}
		ret.push({
			lat: lat/Math.PI*180,
			lon: lon/Math.PI*180
		})
	}
	return ret;
}