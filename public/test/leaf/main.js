require.config({
	paths:{
		'jquery':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
		,'underscore':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
		,'backbone':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
		,'leaflet':'https://cdn.bootcss.com/leaflet/1.0.0-rc.1/leaflet'
		
	},
	shim:{

	}
})

require(
[
	'jquery'
	,'underscore'
	,'backbone'
	,'leaflet'
],
function($, _, Backbone, L){
	var map = L.map('mapdiv').setView([30.25, 120.25], 13);
	
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-        SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
     maxZoom: 18
   }).addTo(map);

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
    		for (var i=0; i < this.collection.length; i++) {
    			var item = this.collection.at(i);
    			var marker = L.marker([item.get('lat'), item.get('lon')]).addTo(map);

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
    		var item = this.collection.findWhere({'code':code});
    		if (!item) return;
    		map.setView([item.get('lat'), item.get('lon')]);
    	},
    	_template:function(){
    		var str = '<% _.each(data, function(item){ %>'+
    			'<div class="locator-item" data="<%= item.code %>" style="height:32px;line-height:32px;border-bottom:dashed 1px #a8a8a8;"><%= item.name %></div>'+
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