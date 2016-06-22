define('test/drawn/view/ToolbarView',
[
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'text!test/drawn/template/ToolbarView.ejs'
    
    , 'test/drawn/util/plot/handler/CircleHandler'
    , 'test/drawn/util/plot/handler/SectorHandler'
],
function($, _, Backbone, tmpl, CircleHandler, SectorHandler){
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
            
            this.layer = new OpenLayers.Layer.Vector('draw-layer');
            this.map.addLayer(this.layer);
            
            
            this.drawTools = {
                circle : new OpenLayers.Control.DrawFeature(this.layer, CircleHandler, {})
                , sector : new OpenLayers.Control.DrawFeature(this.layer, SectorHandler, {})
            };
            
            _.each(this.drawTools, function(control) {
                self.map.addControl(control);
                control.events.register('featureadded', self._drawEnd, self);
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
                default:
                    // code
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