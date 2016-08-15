define('test/transform/view/GaodeMapView',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'OpenLayers'
    , 'olext/layer/cache/GaodeTiledCache'
    , 'olext/layer/GaodeTiledLayer'
],
function($, _, Backbone, OpenLayers, GaodeTiledCache, GaodeTiledLayer){
    var GaodeMapView = Backbone.View.extend({
        initialize : function() {
            
        }
        , render : function() {
            var map = new OpenLayers.Map('gaodeMapDiv');
            
        	var layer = new OpenLayers.Layer.OSM();
        	layer.url = ['https://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'https://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'https://c.tile.openstreetmap.org/${z}/${x}/${y}.png'];
            /*
            var layer = new GaodeTiledLayer('gaode',
                "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x=${x}&y=${y}&z=${z}");
                */
            map.addLayer(layer);
            map.zoomToMaxExtent();
            map.setCenter(new OpenLayers.LonLat(120.25, 30.25).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject()
                ), 15);
            
        }
    });
    
    return GaodeMapView;
})