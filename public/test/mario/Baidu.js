    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    
    var wgs84togcj02 = function wgs84togcj02(lng, lat) {
        var lat = +lat;
        var lng = +lng;
        if (out_of_china(lng, lat)) {
            return [lng, lat]
        } else {
            var dlat = transformlat(lng - 105.0, lat - 35.0);
            var dlng = transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [mglng, mglat]
        }
            
    };
  
    var gcj02tobd09 = function gcj02tobd09(lng, lat) {
        var lat = +lat;
        var lng = +lng;
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    }
    
    var out_of_china = function out_of_china(lng, lat) {
        var lat = +lat;
        var lng = +lng;
        // 纬度3.86~53.55,经度73.66~135.05 
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    };
    
      var transformlat = function transformlat(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  };

  var transformlng = function transformlng(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
  };
    
    $(function(){
        // 自定义分辨率和瓦片坐标系
        var resolutions = [];
        var maxZoom = 18;
        
        // 计算百度使用的分辨率
        for(var i=0; i<=maxZoom; i++){
          resolutions[i] = Math.pow(2, maxZoom-i);
        }
        
        var tilegrid  = new ol.tilegrid.TileGrid({
          origin: [0,0],    // 设置原点坐标
          resolutions: resolutions    // 设置分辨率
        });
        
        var coord = [120.21844, 30.2096];
        var gcj = wgs84togcj02(coord[0], coord[1]);
        var tCoord = gcj02tobd09(gcj[0], gcj[1]);
        
        console.log(tCoord);
    
        // 创建百度地图的数据源
        var baiduSource = new ol.source.TileImage({
          projection: 'EPSG:3857',    
          tileGrid: tilegrid,
          tileUrlFunction: function(tileCoord, pixelRatio, proj){
              var z = tileCoord[0];
              var x = tileCoord[1];
              var y = tileCoord[2];
        
              // 百度瓦片服务url将负数使用M前缀来标识
              if(x<0){
                  x = 'M' + (-x);
              }
              if(y<0){
                  y = 'M' + (-y);
              }
        
              return "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20160426&scaler=1&p=0";
          }
        });
    
        // 百度地图层
        var baiduMapLayer2 = new ol.layer.Tile({
            source: baiduSource
        });
    
        // 创建地图
        new ol.Map({
            layers: [
                baiduMapLayer2
            ],
            view: new ol.View({
                center: ol.proj.transform(tCoord, 'EPSG:4326', 'EPSG:3857'),
                zoom: 16
            }),
            target: 'baiduMap'
        });
    })