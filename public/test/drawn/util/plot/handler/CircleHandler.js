define('test/drawn/util/plot/handler/CircleHandler',
[
    'test/drawn/util/plot/handler/PlotHandler',
    'test/drawn/util/plot/shape/GeoCircle'
],
function(PlotHandler, GeoCircle){
    var CircleHandler = OpenLayers.Class(PlotHandler, {
        initialize : function(control, callbacks, options) {
            PlotHandler.prototype.initialize.apply(this, arguments);
        }
        , createFeature : function(pixel) {
            var lonlat = this.layer.getLonLatFromViewPortPx(pixel);
            var geometry = new OpenLayers.Geometry.Point(
                lonlat.lon, lonlat.lat
            );
            this.point = new OpenLayers.Feature.Vector(geometry);
    
            //标绘扩展符号的 Geometry 类型为 GeoCircle
            this.plotting = new OpenLayers.Feature.Vector(
                new GeoCircle()
            );
    
            this.callback("create", [this.point.geometry, this.getSketch()]);
            this.point.geometry.clearBounds();
        }
        , destroyFeature : function() {
            
        }
        , up : function(evt) {
            this.mouseDown = false;
            this.stoppedDown = this.stopDown;
            
            if (this.lastDown && this.passesTolerance(this.lastDown, evt.xy, this.pixelTolerance)) {
                this.lastUp = evt.xy;
                
                this.addControlPoint(evt.xy);
                
                var len = this.controlPoints.length;
                
                if (len == 1) {
                    this.isDrawing = true;
                } else if (len == 2) {
                    this.drawComplete();
                }
                
                return true;
                
            } else {
                return true;
            }
        }
    })
    
    return CircleHandler;
})