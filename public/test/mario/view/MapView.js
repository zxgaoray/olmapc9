//视图：地图
define('test/mario/view/MapView',
[
    'jquery',
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/util/ViewIdGenerator',
    'ol3'
],
function($, _, Backbone, Radio, Mn, Vig, ol){
    var MapView = Mn.View.extend({
        initialize : function() {
            this.mid = Vig.generate();
        },
        templateContext : function() {
            return {
                mid : this.getOption('mid')
            }  
        },
        initMap : function(mapdiv) {
            var map = new ol.Map({
                target : mapdiv,
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view : new ol.View({
                    center : ol.proj.fromLonLat([120, 30]),
                    zoom : 4
                })
            });

            this.map = map;
            
            this.trigger('map-did-init');
        },
        _template : function() { 
            return '<div id="mainMap" class="map ngmap"></div>';
        }
    });
    
    return MapView;
})