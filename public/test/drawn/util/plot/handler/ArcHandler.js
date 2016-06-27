define('test/drawn/util/plot/handler/ArcHandler',
[
    'test/drawn/util/plot/handler/PlotHandler'
    , 'test/drawn/util/plot/shape/GeoArc'
],
function(PlotHandler, GeoArc){
    var ArcHandler = OpenLayers.Class(PlotHandler, {
        initialize : function(control, callbacks, options) {
            PlotHandler.prototype.initialize.apply(this, arguments);
        }
        , createFeature : function(pixel) {
            var lonlat = this.layer.getLonLatFromViewPortPx(pixel);
            var geometry = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            this.point = new OpenLayers.Feature.Vector(geometry);
            
            this.plotting = new OpenLayers.Feature.Vector(new GeoArc());
            
            this.callback('create', [this.point.geometry, this.getSketch()]);
            this.point.geometry.clearBounds();
        }
        , up : function(evt) {
            this.mouseDown = false;
            this.stoppedDown = this.stopDown;
            
            if (this.lastUp && this.lastUp.equals(evt.xy)) {
                return true;
            }
            
            if (this.lastDown && this.passesTolerance(this.lastDown, evt.xy, this.pixelTolerance)) {
                if (this.touch) {
                    this.modifyFeature(evt.xy);
                }
                
                if (this.persist) {
                    this.destroyPersistedFeature();
                }
                
                this.lastUp = evt.xy;
                
                this.addControlPoint(evt.xy);
                var len = this.controlPoints.length;
                if (len == 1 || len == 2) {
                    this.isDrawing = true;
                } else if (len == 3) {
                    this.isDrawing = false;
                    this.drawComplete();
                }
                return true;
            } else {
                return true;
            }
        }
    })
    
    return ArcHandler;
})