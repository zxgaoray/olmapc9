define('test/drawn/util/plot/shape/GeoBezierCurve2',
[
    'test/drawn/util/plot/shape/GeoLinePlot'
],
function(GeoLinePlot){
    if (typeof OpenLayers.Geometry.LineString.prototype.calculatePointsFBZ2 != 'function') {
        OpenLayers.Geometry.LineString.prototype.calculatePointsFBZ2 = function(controlPoints, geometry){
            return [];
        }    
    }
    
    var GeoBezierCurve2 = OpenLayers.Class(GeoLinePlot, {
        part : 50
        , initialize : function(points) {
            GeoLinePlot.prototype.initialize.apply(this, arguments);
        }
        , clone : function(){
            var geometry = new GeoBezierCurve2();
            
            var controlPoints = [];
            
            for (var i=0, len = this._controlPoints.length; i < len; i++) {
                controlPoints.push(this._controlPoints[i].clone());
            }
            
            geometry._controlPoints = controlPoints;
            return geometry;
        }
        , calculateParts : function(){
            var controlPoints = this.cloneControlPoints(this._controlPoints);
            this.components = [];
            
            if (controlPoints.length == 2) {
                this.components = controlPoints;
            } else if (controlPoints.length > 2) {
                this.components = OpenLayers.Geometry.LineString.prototype.calculatePointsFBZ2.call(this, controlPoints, this.part);
            }
        }
    });
    
    return GeoBezierCurve2;
})