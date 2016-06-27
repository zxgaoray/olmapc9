define('test/drawn/util/plot/shape/GeoArc',
[
    'test/drawn/util/plot/shape/GeoLinePlot'
],
function(GeoLinePlot) {
    var GeoArc = OpenLayers.Class(GeoLinePlot, {
        sides : 720
        , initialize : function(points) {
            GeoLinePlot.prototype.initialize.apply(this, arguments);
        }
        , clone : function() {
            var geoArc = new GeoArc();
            var controlPoints = [];
            
            for (var i=0, len = this._controlPoints.length; i < len; i++) {
                controlPoints.push(this._controlPoints[i].clone());
            }
            geoArc._controlPoints = controlPoints;
            return geoArc;
        }
        , calculateParts : function() {
            
        }
        , calculateAngle : function() {
            
        }
    });
    
    return GeoArc;
})