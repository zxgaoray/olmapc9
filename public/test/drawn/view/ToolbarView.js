define('test/drawn/view/ToolbarView',
[
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'text!test/drawn/template/ToolbarView.ejs'
    
    , 'test/drawn/util/plot/handler/CircleHandler'
    , 'test/drawn/util/plot/handler/SectorHandler'
    , 'test/drawn/util/plot/handler/RectangleHandler'
],
function($, _, Backbone, tmpl, CircleHandler, SectorHandler, RectangleHandler){
    var Clz = Backbone.View.extend({
        el : '#toolbardiv',
        initialize : function(opt){
            var self = this;
            this.options = {
                
            };
            _.extend(this.options, opt);
            this.map = this.options.map;
            
            this.template = _.template(tmpl);
            
            this.elems = {
                'drawToolBtn' : '.tool-select-feature'
            }
            
            this.events = {
                'click drawToolBtn' : '_drawToolBtn_clickHandler'
            }
            
            this.plottingLayer = new OpenLayers.Layer.Vector('draw-layer');
            this.map.addLayer(this.plottingLayer);
            
            this.plottingLayer.style = {
                fillColor: "#66cccc",
                fillOpacity: 0.4,
                strokeColor: "#66cccc",
                strokeOpacity: 1,
                strokeWidth: 3,
                pointRadius:6
            };
            
            
            this.drawTools = {
                circle : new OpenLayers.Control.DrawFeature(this.plottingLayer, CircleHandler, {})
                , sector : new OpenLayers.Control.DrawFeature(this.plottingLayer, SectorHandler, {})
                , rectangle : new OpenLayers.Control.DrawFeature(this.plottingLayer, RectangleHandler, {})
            };
            
            _.each(this.drawTools, function(control) {
                self.map.addControl(control);
                control.events.on({'featureadded':self._drawEnd})
            })
            
            this.render();
        }
        ,render : function(){
            $(this.el).html(this.template());
            
            this._bindEvent(this.events);
        }
        , _bindEvent : function(events) {
            var self = this;
			_.map(events, function(value, key){
				var evt = key.split(" ")[0];
				var tarName = key.split(" ")[1];
				var tar = self.elems[tarName];
				if (typeof $(tar)[evt] === 'function'){
					$(tar)[evt](function(){
						if (typeof self[value] === 'function') {
							Clz.prototype[value].apply(self, arguments);
						}
					})
				}
			});
        }
        , _drawEnd : function(e) {
            for (key in this.drawTools) {
                var control = this.drawTools[key];
                control.deactivate();
            }
        }
        , _drawToolBtn_clickHandler : function(e) {
            var data = $(e.currentTarget).attr('data');
            switch (data) {
                case 'select-by-circle':
                    // code
                    this._beginDraw('circle');
                    break;
                case 'select-by-sector':
                    this._beginDraw('sector');
                    break;
                case 'select-by-rect':
                    this._beginDraw('rectangle');
                    break;
                default:
                    // code
                    break;
            }
            
        }
        , _beginDraw : function(value) {
            for (key in this.drawTools) {
                var control = this.drawTools[key];
                if (value == key) {
                    control.activate();
                } else {
                    control.deactivate();
                }
            }
        }
    });
    
    return Clz;
})