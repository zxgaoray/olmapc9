require.config({
	paths:{
		'jquery':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
		,'underscore':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
		,'backbone':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
		,'test':'/test'
	},
	shim:{
		'backbone':['underscore']
	}
})

require(
[
	'jquery'
	,'underscore'
	,'backbone'
	,'test/staticmap/util/AnimatedClusterStrategy'
],
function($, _, Backbone, AnimatedClusterStrategy){
    $('body').bind('contextmenu',function(){
        return false;
    });
    
    var imgSizeLod = {
        0 : [4, 2],
        1 : [4, 2],
        2 : [4, 2],
        3 : [4, 2],
        4 : [4, 2],
        5 : [4, 2],
        6 : [4, 2],
        7 : [4, 2],
        8 : [4, 2],
        9 : [4, 2],
        10 : [8, 4],
        11 : [15, 8],
        12 : [30, 17],
        13 : [60, 34],
        14 : [120, 68],
        15 : [240, 135],
        16 : [480, 270],
        17 : [960, 540],
        18 : [1920, 1080]
    }
	var map = new OpenLayers.Map('mapdiv');
	var layer = new OpenLayers.Layer.OSM();
    map.addLayer(layer);
    layer.setVisibility(false);
    
    map.setCenter(new OpenLayers.LonLat(120.25, 30.25).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 18);
        
    var markerLayer = new OpenLayers.Layer.Markers('img');
    map.addLayer(markerLayer);
    
    var item = {
        code:'code1',
        name:'item1',
        lon:120.25,
        lat:30.25
    }
    
    var imgsize = imgSizeLod[map.zoom]; 
    var w = imgsize[0];
    var h = imgsize[1];
    var size = new OpenLayers.Size(w, h);
    var offset = new OpenLayers.Pixel(-w/2, -h/2);
    var icon = new OpenLayers.Icon('https://www.bing.com/az/hprichbg/rb/BomboHeadland_ZH-CN9339065341_1920x1080.jpg', size, offset);
    
    var lonlat = new OpenLayers.LonLat(item['lon'], item['lat']).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    
    var marker = new OpenLayers.Marker(lonlat, icon);
	marker.code = item['code'];
	markerLayer.addMarker(marker);
	
	var pinLayer = new OpenLayers.Layer.Markers('pin');
	map.addLayer(pinLayer);
	
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
	
	
    var colors = {
        low : 'rgb(181, 226, 140)',
        middle : 'rgb(241, 211, 87)',
        high : 'rgb(253, 156, 115)'
    }
    
    var iconRule = new OpenLayers.Rule({
        filter : new OpenLayers.Filter.Comparison({
            type:OpenLayers.Filter.Comparison.LESS_THAM,
            property : "count",
            value : 2
        }),
        symbolizer : {
            fillColor : colors.low
            ,fillOpacity : 0.9
            ,strokeColor : colors.low
            ,strokeOpacity : 0.5
            ,strokeWidth : 12
            ,pointRadius : 10
            ,labelOutlineWidth : 1
            ,fontColor : '#3333ff'
            ,fontSize : '12px'
            ,externalGraphic : 'http://www.openlayers.org/dev/img/marker.png'
        }
    });
    
    var lowRule = new OpenLayers.Rule({
        filter : new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.LESS_THAM
            ,property : "count"
            ,value : "15"
        })
        ,symbolizer : {
            fillColor : colors.low
            ,fillOpacity : 0.9
            ,strokeColor : colors.low
            ,strokeOpacity : 0.5
            ,strokeWidth : 12
            ,pointRadius : 10
            ,label : "${count}"
            ,labelOutlineWidth : 1
            ,fontColor : "#ffffff"
            ,fontOpacity : 0.8
            ,fontSize : "12px"
        }
    });
    
    var middleRule = new OpenLayers.Rule({
        filter : new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.BETWEEN
            ,property : "count"
            ,lowerBoundary : 15
            ,upperBoundary : 50
        })
        ,symbolizer : {
            fillColor : colors.middle
            ,fillOpacity : 0.9
            ,strokeColor : colors.middle
            ,strokeOpacity : 0.5
            ,strokeWidth : 12
            ,pointRadius : 15
            ,label : "${count}"
            ,labelOutlineWidth : 1
            ,fontColor : '#ffffff'
            ,fontOpacity : 0.8
            ,fontSize : "12px"
        }
    })
    
    var highRule = new OpenLayers.Rule({
        filter : new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.GREATER_THAN
            ,property : "count"
            ,value : 50
        })
        ,symbolizer : {
            fillColor : colors.high
            ,fillOpacity : 0.9
            ,strokeColor : colors.high
            ,strokeOpacity : 0.5
            ,strokeWidth : 12
            ,pointRadius : 20
            ,label : "${count}"
            ,labelOutlineWidth : 1
            ,fontColor : "#ffffff"
            ,fontOpacity : 0.8
            ,fontSize : "12px"
        }
    })
    
    var aclStyle = new OpenLayers.Style(null, {
        rules : [lowRule, middleRule, highRule, iconRule]
    });
    
	var animatedClusterLayer = new OpenLayers.Layer.Vector('animated-cluster', {
	    strategies : [
	        new AnimatedClusterStrategy({
	            distance : 45
	            ,animationMethod : OpenLayers.Easing.Expo.easeOut
	            ,animationDuration : 20
	        })
	        ]
        ,styleMap : new OpenLayers.StyleMap({
            "default" : aclStyle
            ,"select" : {
                fillColor : '#8aeeef'
                ,strokeColor : '#32a8a9'
            }
        })
	})
	
	map.addLayer(animatedClusterLayer);
	
	function createMarkers() {
	    for (var i=0; i < 10; i++) {
    	    var item = {
    	        code:'code_'+i,
                name:'item_'+i,
                lon:120.25 + Math.random()*0.002,
                lat:30.25 + Math.random()*0.002
    	    }
    	    var size = new OpenLayers.Size(25,41);
    		var offset = new OpenLayers.Pixel(12, -40);
    		
    		var lonlat = new OpenLayers.LonLat(item.lon, item.lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
    		var icon = new OpenLayers.Icon('https://cdn.bootcss.com/leaflet/1.0.0-rc.1/images/marker-icon.png', size, offset);
    		var marker = new OpenLayers.Marker(lonlat, icon);
    		marker.code = item.code;
    		
    		marker.events.register('mousedown', this, function(e){
        		if (OpenLayers.Event.isRightClick(e)) { 
        		    var lonlat = e.object.lonlat;
                    var txt = e.object.code;
                    activePopup(lonlat, txt);
                     
                }else{
                    alert("Left button click");
                }
            })
    		
    		pinLayer.addMarker(marker);
    	}
	}
	
	var popup = null;
	
	function activePopup (lonlat, txt) {
	    if (popup) {
	        map.removePopup(popup);
	        popup = null;
	    }
	    popup = new OpenLayers.Popup(txt,
                   lonlat,
                   new OpenLayers.Size(100, 40),
                   txt,
                   true);

        map.addPopup(popup);
	}
    
    map.events.register('zoomend', this, function(){
        var imgsize = imgSizeLod[map.zoom]; 
        var w = imgsize[0];
        var h = imgsize[1];
        var size = new OpenLayers.Size(w, h);
        var offset = new OpenLayers.Pixel(-w/2, -h/2);
        marker.icon.size = size;
        marker.icon.offset = offset;
        marker.icon.draw();
    })
    
    
    createMarkers();
    
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
    
    $.ajax({
        url : '/test/animatedClusterPoints?offset=0.002'
        ,success : function(json){
            var features = [];
            for (var i=0; i < json.length; i++) {
                var item = json[i];
                var lonlat = new OpenLayers.LonLat(item.lon, item.lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
                var geometry = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                var attrs = item;
                var feature = new OpenLayers.Feature.Vector(geometry, attrs);
                
                features.push(feature);
            }
            animatedClusterLayer.addFeatures(features);
        }
    })
    
})