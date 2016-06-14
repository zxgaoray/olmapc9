define('app/olmap/view/MapView',
[
    'jquery',
    'underscore',
    'backbone'
],
function($, _, Backbone){
    var v = Backbone.View.extend({
        initialize:function(){
            this.render();
        },
        render:function(){
            var earth = new OpenLayers.Layer.XYZ(
                "Natural Earth",
                [
                    "http://a.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                    "http://b.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                    "http://c.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                    "http://d.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png"
                ], {
                    attribution: "Tiles &copy; <a href='http://mapbox.com/'>MapBox</a>",
                    sphericalMercator: true,
                    wrapDateLine: true,
                    numZoomLevels: 5
                }
            );
            
            var map = new OpenLayers.Map({
                div: "mapdiv",
                layers: [earth],
                center: [0, 0],
                zoom: 1
            });
            this.map = map;
        }
    });
    
    return v;
})