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
    
    var view = new ol.View({
        center: ol.proj.fromLonLat([120, 30], 'EPSG:3857'),
        zoom: 8
    });
    
    
    var osmlyr = new ol.layer.Tile({
        source: new ol.source.OSM()
    });


    var binglyr = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'AkjzA7OhS4MIBjutL21bkAop7dc41HSE0CNTR5c6HJy8JKc7U9U9RveWJrylD3XJ',
            imagerySet: 'Road'
        })
    });
    
    var map = new ol.Map({
        layers: [
            osmlyr
        ],
        view: view,
        target: 'my-map'
    })
    
    var map2 = new ol.Map({
        layers: [
            binglyr
        ],
        view: view,
        target: 'my-map-2'
    })
    
    function actUICommand(command) {
        switch (command) {
            case 'left':
                var mapCenter = view.getCenter();
                mapCenter[0] += 50000;
                view.setCenter(mapCenter);
                map.render();
                map2.render();
                break;
            case "right":
                var mapCenter = view.getCenter();
                mapCenter[0] -= 50000;
                view.setCenter(mapCenter);
                map.render();
                map2.render();
                break;
            case "top" :
                var mapCenter = view.getCenter();
                mapCenter[1] -= 50000;
                view.setCenter(mapCenter);
                map.render();
                map2.render();
                break;
            case "down":
                var mapCenter = view.getCenter();
                mapCenter[1] += 50000;
                view.setCenter(mapCenter);
                map.render();
                map2.render();
                break;
            case "zoom-in":
                view.setZoom(view.getZoom() + 1);
                break;
            case "zoom-out":
                view.setZoom(view.getZoom() - 1);
                break;
            
            default:
                // code
        }
    }
    
    $('.command .btn').click(function(){
        var command = $(this).attr('data');
        actUICommand(command);
    });
    
    
    
    
})