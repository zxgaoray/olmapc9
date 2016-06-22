define('test/drawn/util/plot/handler/PlotHandler',
[
    'underscore'
],
function(_){
    var Plot = OpenLayers.Class(OpenLayers.Handler, {
        controlPoints : []
        , plotting : null
        , isDrawing : false
        , layerOptions : null
        , layerOptions : null
        , pixelTolerance : 5
        , point : null
        , layer : null
        , multi : false
        , mouseDown : false
        , stoppedDown : null
        , lastDown : null
        , lastUp : null
        , presist : false
        , stopDown : false
        , stopUp : false
        , touch : false
        , lastTouchPx : null
        , CLASS_NAME : 'PlotHandler'
        , initialize : function(control, callbacks, options) {
            if (!(options && options.layerOptions && options.layerOptions.styleMap)) {
                if (!this.style) {
                    this.style = OpenLayers.Util.extend(OpenLayers.Feature.Vector.style['default'], {});
                }
            }
            
            OpenLayers.Handler.prototype.initialize.apply(this, arguments);
            
            //this.layer = this.control.layer;
        }
        , activate : function() {
            if (! OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
                return false;
            }
            
            this.controlPoints = [];
            this.plotting = null;
            this.isDrawing = false;
            
            var options = OpenLayers.Util.extend({
                displayInLayerSwitcher : false
                , calculateInRange :OpenLayers.Function.True
            }, this.layerOptions);
            
            this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, options);
            //this.layer = new OpenLayers.Layer.Vector();
            this.map.addLayer(this.layer);
            
            return true;
        }
        , deactivate : function() {
            if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
                return false;
            }
            
            this.controlPoints = [];
            this.plotting = null;
            this.isDrawing = false;
            
            this.cancel();
            
            if (this.layer.map != null) {
                
                this.destroyFeature(true);
                this.layer.destroy(false);
            }
            
            this.layer = null;
            this.touch = false;
            
            return true;
        }
        , createFeature : function(pixel) {}
        , modifyFeature : function(pixel) {
            if (this.lastUp && this.lastUp.equals(pixel)) {
                return true;
            }
            
            if (!this.point || !this.plotting) {
                this.createFeature(pixel);
            }
            
            var lonlat = this.layer.getLonLatFromViewPortPx(pixel);
            this.point.geometry.x = lonlat.lon;
            this.point.geometry.y = lonlat.lat;
            
            if (this.isDrawing == true) {
                var geometry = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                
                var cp = this.controlPoints.concat([geometry]);
                this.plotting.geometry._controlPoints = this.cloneControlPoints(cp);
                this.plotting.geometry.calculateParts();
            }
            
            //this.callback("modify", [this.point.geometry, this.getSketch(), false]);
            
            this.point.geometry.clearBounds();
            this.drawFeature();
        }
        , up : function (evt) {}
        , down : function(evt) {
            this.mouseDown = true;
            this.lastDown = evt.xy;
            if (!this.touch) {
                this.modifyFeature(evt.xy);
            }
            this.stoppedDown = this.stopDown;
            return !this.stopDown;
        }
        , move : function(evt) {
            if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
                this.modifyFeature(evt.xy);
            }
            
            return true;
        }
        , click : function(evt) {
            OpenLayers.Event.stop(evt);
            return false;
        }
        , dbclick : function(evt) {
            OpenLayers.Event.stop(evt);
            return false;
        }
        , addControlPoint : function(pixel) {
            var lonlat = this.layer.getLonLatFromViewPortPx(pixel);
            var geometry = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            this.controlPoints.push(geometry);
        }
        , drawFeature : function() {
            this.layer.renderer.clear();
            this.layer.drawFeature(this.plotting, this.style);
            this.layer.drawFeature(this.point, this.style);
        }
        , getSketch : function() {
            return this.plotting;
        }
        , destroyFeature : function(force) {
            if(this.layer && (force || !this.persist)) {
                this.layer.destroyFeatures();
            }
            this.point = null;
            this.plotting = null;
        }
        , destroyPersistedFeature : function() {
            var layer = this.layer;
            if (layer && layer.features.length > 1) {
                this.layer.features[0].destroy();
            }
        }
        , finalize : function(cancel) {
            var key = cancel ? "cancal" : "done";
            this.mouseDown = false;
            this.lastDown = null;
            this.lastUp = null;
            this.lastTouchPx = null;
            //this.callback(key, [this.geometryClone()]);
            this.destroyFeature(cancel);
        }
        , cancel : function() {
            this.finalize(true);
        }
        , getGeometry : function() {
            if(this.plotting && this.plotting.geometry){
                return this.plotting.geometry;
            }
        }
        , geometryClone : function() {
            var geom = this.getGeometry();
            if(geom && geom._controlPoints){
                var geo =  geom.clone();
                geo.calculateParts();
                return geo;
            }
        }
        , mousedown : function(evt) {
            return this.down(evt);
        }
        , mousemove : function(evt) {
           return this.move(evt); 
        }
        , mouseup : function(evt) {
            return this.up(evt);
        }
        , mouseout : function(evt) {
            if (OpenLayers.Util.mouseLeft(evt, this.map.eventsDiv)) {
                this.stoppedDown = this.stopDown;
                this.mouseDown = false;
            }
        }
        , passesTolerance : function(pixel1, pixel2, tolerance) {
            var passes = true;
            if (tolerance != null && pixel1 && pixel2) {
                var distance = pixel1.distanceTo(pixel2);
                if (distance > tolerance) {
                    passes = false;
                }
            }
            
            return passes;
        }
        , cloneControlPoints : function(cp) {
            var controlPoints = [];

            for(var i = 0; i < cp.length; i++){
                controlPoints.push(cp[i].clone());
            }
    
            return controlPoints;
        }
        , drawComplete : function() {
            this.finalize();
            this.isDrawing = false;
            this.controlPoints = [];
            
            if (this.active == true) {
                //this.layer.removeAllFeatures();
            }
        }
    })
    
    return Plot;
})