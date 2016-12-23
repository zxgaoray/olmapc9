var __ctx = "";

require.config({
    paths : {
        'jquery' : __ctx + '/vendor/jquery-dist/jquery.min',
        'underscore' : __ctx + '/vendor/underscore/underscore-min',
        'backbone' : __ctx + '/vendor/backbone/backbone-min',
        'ol3' : __ctx + '/vendor/ol3/ol'
    }
})

require([
    'jquery',
    'underscore',
    'backbone',
    'ol3'
    
],
function($, _, Bb, ol){
    
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([120, 30], 'EPSG:3857'),
            zoom: 8
        }),
        target: 'my-map'
    })
    
    var map2 = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([120, 30], 'EPSG:3857'),
            zoom: 8
        }),
        target: 'my-map-2'
    })
    
    function swapMap() {
        map.setTarget('my-map-2');
        map2.setTarget('my-map');
    }
    
    $('#swapMap').click(function(){
        swapMap();
    })
    
    
    
    
})