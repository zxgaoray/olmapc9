/**
 * Created by gaozhixiang on 2016/12/7.
 */
define('test/mario/gis/TileParams',
[

],
function () {
    var params = {
        //天地图
        //矢量
        'tdt-vec' : 'http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}',
        //影像
        'tdt-img' : 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}',
        //地形
        'tdt-ter' : 'http://t3.tianditu.cn/ter_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ter&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles',
        //标注
        'tdt-anno' : 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}',
        //高德
        'gaode-vec' : "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
    };

    return {
        tileURL : function (key) {
            return params[key];
        }
    }
});