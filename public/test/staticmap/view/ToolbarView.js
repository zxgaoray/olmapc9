define('test/staticmap/view/ToolbarView',
[
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'text!test/staticmap/template/ToolbarView.ejs'
    
    , 'test/staticmap/util/PlotHandler'
    , 'test/staticmap/util/GeoCircle'
],
function($, _, Backbone, tmpl, PlotHandler, GeoCircle){
    var Clz = Backbone.View.extend({
        el : '#toolbardiv',
        initialize : function(opt){
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
            
            this.layer = new OpenLayers.Layer.Vector('draw-layer');
            this.map.addLayer(this.layer);
            
            this.drawTool = new OpenLayers.Control.DrawFeature(this.layer, PlotHandler, {});
            this.map.addControl(this.drawTool);
            this.drawTool.events.register('featureadded', this._drawEnd, this);
            
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
            console.log(e);
            
            this.drawTool.deactivate();
        }
        , _drawToolBtn_clickHandler : function(e) {
            var data = $(e.currentTarget).attr('data');
            console.log(data);
            this.drawTool.activate();
        }
    });
    
    return Clz;
})