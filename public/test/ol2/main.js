require.config({
	paths:{
		'jquery':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
		,'underscore':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
		,'backbone':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
		, 'OpenLayers' : 'https://cdn.bootcss.com/openlayers/2.13.1/OpenLayers'
	},
	shim:{
		'backbone':['underscore']
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
],
function($, _, Backbone, OpenLayers, nicescroll){
	var map = new OpenLayers.Map('mapdiv');
	var layer = new OpenLayers.Layer.OSM();
	layer.url = ['https://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
        'https://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
        'https://c.tile.openstreetmap.org/${z}/${x}/${y}.png'];
    map.addLayer(layer);
    map.zoomToMaxExtent();
    map.setCenter(new OpenLayers.LonLat(120.25, 30.25).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 18);


    var LocatorCollection = Backbone.Collection.extend({
    	initialize:function(){

    	}
    })

    var LocatorView = Backbone.View.extend({
    	el:'#locator',
    	events:{
    		'click .locator-item':'_locatorItem_clickHandler'
    	},
    	initialize:function(){
    		this.collection = new LocatorCollection();
    		this.template = _.template(this._template());

    		var layer = new OpenLayers.Layer.Markers('markers');
    		this.layer = layer;
    		map.addLayer(layer);
    	},
    	render:function(){
    		$(this.el).html(this.template({
    			data:this.collection.toJSON()
    		}))

    		this._addMakerToLayer();
    	},
    	fetchData:function(){
    		this.collection.set(this._data());
    	},
    	_addMakerToLayer:function(){
    		var size = new OpenLayers.Size(25,41);
			var offset = new OpenLayers.Pixel(12, -40);
    		
    		for (var i=0; i < this.collection.length; i++) {
    			var item = this.collection.at(i);
    			var lonlat = new OpenLayers.LonLat(item.get('lon'), item.get('lat')).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
    			var icon = new OpenLayers.Icon('https://cdn.bootcss.com/leaflet/1.0.0-rc.1/images/marker-icon.png', size, offset);
    			var marker = new OpenLayers.Marker(lonlat, icon);
    			marker.code = item.get('code');
    			this.layer.addMarker(marker);

    		}
    	},
    	_locatorItem_clickHandler:function(e){
    		$('.locator-item').css({
    			'background-color':'#fff'
    		})

    		$(e.currentTarget).css({
    			'background-color':'#3f85e4'
    		})

    		var code = $(e.currentTarget).attr('data');
    		var marker = _.findWhere(this.layer.markers, {'code':code});
    		if (!marker) return;
    	    map.moveTo(marker.lonlat, 17);
    	    map.zoomTo(18);
    	},
    	/*
    	openlayers2 api 在https协议下 定位会出现问题；定位的时候强制做一次缩放地图，让部分地图参数归0;
    	*/
    	_httpsCenterAt:function(map, lonlat){
    	    var zoom = map.zoom;
    	    var offset = -1;
    	    if (zoom === 0) offset = 1;
    	    map.moveTo(lonlat, zoom + offset);
    	    map.zoomTo(zoom - offset);
    	},
    	_template:function(){
    		var str = '<% _.each(data, function(item){ %>'+
    			'<div class="list-item locator-item" data="<%= item.code %>"><%= item.name %></div>'+
    		'<% }) %>';
    		return str;
    	},
    	_data:function(){
    		var arr = [];
    		for (var i=0; i < 20; i++) {
    			arr.push({
    				name:'test'+i,
    				code:'test'+i,
    				lon:120.0 + i,
    				lat:30.0 + i
    			})
    		}

    		return arr;
    	}
    })

    var locatorView = new LocatorView();
    locatorView.fetchData();
    locatorView.render();

    
})