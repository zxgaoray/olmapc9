/**
 * Created by gaozhixiang on 2016/12/7.
 */
define('test/mario/gis/TileParams',
[

],
function () {
    var params = {
        'tdt-vec' : 'http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}',
        'tdt-img' : 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}',
        'tdt-ter' : 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}',
        'tdt-anno' : 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}',
        'gaode-vec' : "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x=${x}&y=${y}&z=${z}"
    };

    return {
        tileURL : function (key) {
            return params[key];
        }
    }
});