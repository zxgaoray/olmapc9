require.config({
	paths:{
		'jquery' : 'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
		,'underscore' : 'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
		,'backbone' : 'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
		,'bootstrap' : 'https://cdn.bootcss.com/bootstrap/2.3.2/js/bootstrap.min'
		, 'OpenLayers' : 'https://cdn.bootcss.com/openlayers/2.13.1/OpenLayers'
		, 'text' : 'https://cdn.bootcss.com/require-text/2.0.12/text.min'
		, 'raphael' : 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.0/raphael.min'
		,'test':'/test'
	},
	shim:{
		'backbone' : ['underscore']
		, 'bootstrap' : ['jquery']
		, 'OpenLayers' : {
			exports : 'OpenLayers'
		}
	}
})

require(
[
	'jquery'
	,'underscore'
	,'backbone'
	, 'OpenLayers'
	,'test/drawn/view/ToolbarView'
	
	,'bootstrap'
],
function($, _, Backbone, OpenLayers, ToolbarView){
    $('body').bind('contextmenu',function(){
        return false;
    });
    
    
	var map = new OpenLayers.Map('mapdiv');
	var layer = new OpenLayers.Layer.OSM();
    map.addLayer(layer);
    layer.setVisibility(false);
    
    map.setCenter(new OpenLayers.LonLat(120.25, 30.25).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 18);
	
	var style = new OpenLayers.Style({
	    pointRadius:'${radius}'
	    ,fillColor:'#44aa44'
	    ,fillOpacity:0.8
	    ,fontColor : '#ffffff'
	    ,fontSize : '12px'
	    ,label : '${count}'
	}, {
	    context:{
	        radius:function(feature){
	            var pix = 2;
	            if (feature.cluster) {
	                pix = Math.min(feature.attributes.count, 8) + 2;
	            }
	            return pix;
	        }
	    }
	})
	var clusterLayer = new OpenLayers.Layer.Vector('cluster', {
	    strategies:[
	        
	        new OpenLayers.Strategy.Cluster({
	            distance:100
	        })
	        /*
	        new AnimatedClusterStrategy({
	            distance:100
	        })*/
	        ],
	    styleMap:new OpenLayers.StyleMap({
	        'default':style
	    })
	});
	map.addLayer(clusterLayer);
    
    var toolbar = new ToolbarView({
        map : map
    });
    
    $.ajax({
        url:'/test/clusterPoints?offset=0.002',
        success:function(json){
            var features = [];
            for (var i=0; i < json.length; i++) {
                var item = json[i];
                var lonlat = new OpenLayers.LonLat(item.lon, item.lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
                var geometry = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                var attrs = item;
                var feature = new OpenLayers.Feature.Vector(geometry, attrs);
                
                features.push(feature);
            }
            clusterLayer.addFeatures(features);
        }
    })
    
})