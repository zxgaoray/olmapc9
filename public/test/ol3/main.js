require.config({
	paths:{
		'jquery':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
		,'underscore':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
		,'backbone':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
        ,'ol':'https://cdn.bootcss.com/ol3/3.16.0/ol'
		
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
	,'ol'
],
function($, _, Backbone, ol){
    /*
    var map = new ol.Map({
        target: 'mapdiv',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'})
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([120.25, 30.25]),
          zoom: 14
        })
    });
    */

    var openCycleMapLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
          attributions: [
            'All maps © <a href="http://www.opencyclemap.org/">OpenCycleMap</a>',
            ol.source.OSM.ATTRIBUTION
          ],
          url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
        })
      });

      var openSeaMapLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
          attributions: [
            'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
            ol.source.OSM.ATTRIBUTION
          ],
          opaque: false,
          url: 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
        })
      });


      var map = new ol.Map({
        renderer:'dom',
        layers: [
          openCycleMapLayer,
          openSeaMapLayer
        ],
        target: 'mapdiv',
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }),
        view: new ol.View({
          center: ol.proj.fromLonLat([120.25, 30.25]),
          zoom: 15
        })
      });


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

    		var layer = new ol.layer.Vector();
    		this.layer = layer;
    		map.addLayer(layer);
    	},
    	render:function(){
    		$(this.el).html(this.template({
    			data:this.collection.toJSON()
    		}))

    		this._addMakerToLayer();

    		/*
    		$(this.el).niceScroll({
			    touchbehavior:false,
			    cursorwidth:6,
			    cursorborder:"0px",
			    cursorborderradius:"3px",
			    background:"rgba(255,255,255,0)",
			    autohidemode:"true",
			});
			*/
    	},
    	fetchData:function(){
    		this.collection.set(this._data());
    	},
    	_addMakerToLayer:function(){
    		var size = [25,41];
			var offset = [12, -40];
    		var source = new ol.source.Vector();
    		for (var i=0; i < this.collection.length; i++) {
    			var item = this.collection.at(i);
    			
                var icon = new ol.style.Icon({
                    src:'https://cdn.bootcss.com/leaflet/1.0.0-rc.1/images/marker-icon.png',
                    size:size,
                    offset:offset
                });

                var feature = new ol.Feature({
                    attributes:item.toJSON()
                    ,geometry:new ol.geom.Point(ol.proj.fromLonLat([item.get('lon'), item.get('lat')]))
                    ,style:icon
                });

    			source.addFeature(feature);

    		}
            this.layer.setSource(source);
    	},
    	_locatorItem_clickHandler:function(e){
    		$('.locator-item').css({
    			'background-color':'#fff'
    		})

    		$(e.currentTarget).css({
    			'background-color':'#3f85e4'
    		})

    		var code = $(e.currentTarget).attr('data');
            var item = this.collection.findWhere({code:code});
            map.getView().setCenter(ol.proj.fromLonLat([item.get('lon'), item.get('lat')]));
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