define('test/transform/view/BaiduMapView',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'OpenLayers'
    , 'olext/layer/cache/BaiduTiledCache'
    , 'olext/layer/BaiduTiledLayer2'
    , 'coordtransform'
],
function($, _, Backbone, OpenLayers, BaiduTiledCache, BaiduTiledLayer, coordtransform){
    var BaiduMapView = Backbone.View.extend({
        initialize : function() {
            
        }
        , render : function() {
            var map = new OpenLayers.Map('baiduMapDiv');
            /*
        	var layer = new OpenLayers.Layer.OSM();
        	layer.url = ['https://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'https://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'https://c.tile.openstreetmap.org/${z}/${x}/${y}.png'];
            */
            var url = 'http://online0.map.bdimg.com/onlinelabel/';
            var layer = new BaiduTiledLayer('baidu', url);
            map.addLayer(layer);
            
            //map.zoomToMaxExtent();
            /*
            var lonlat = new OpenLayers.LonLat(120.25, 30.25);
            */
            var lonlat = new OpenLayers.LonLat(70.8, 18.6).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject()
                );
            map.setCenter(lonlat, 15);
            
            console.log(lonlat);
            console.log(map.getProjectionObject());
            console.log(map.getZoom());
            
            map.events.register('click', map, function(){
                console.log(map.getCenter());
                
                var bd09togcj02 = coordtransform.bd09togcj02(116.404, 39.915);
                console.log(bd09togcj02);
            })
            
            console.log(map.getCenter());
            
            
            
        }
    })
    
    return BaiduMapView;
})