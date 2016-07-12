define('test/drawn/util/plot/shape/GeoCircle',
[
    'OpenLayers'
    , 'test/drawn/util/plot/shape/GeoPlot'
],
function(OpenLayers, GeoPlot){
    var Circle = OpenLayers.Class(GeoPlot, {
        initialize : function() {
            GeoPlot.prototype.initialize.apply(this, arguments);
        }
        , clone : function() {
            var geoCircle = new Circle();
            var controlPoints = [];
            for(var i = 0, len = this._controlPoints.length; i<len; i++)
            {
                controlPoints.push(this._controlPoints[i].clone());
            }
            geoCircle._controlPoints = controlPoints;
            return geoCircle;
        }
        , calculateParts : function() {
            this.components = [];
            
            if (this._controlPoints.length > 1) {
                var centerPoint = this._controlPoints[0];
                
                var radiusPoint = this._controlPoints[this._controlPoints.length - 1];
                
                var points = [];
                
                var radius = Math.sqrt((radiusPoint.x - centerPoint.x) * (radiusPoint.x -centerPoint.x) + (radiusPoint.y - centerPoint.y) * (radiusPoint.y - centerPoint.y));
                
                for (var i = 0; i < 360; i++) {
                    var radians = (i+1)*Math.PI / 180;
                    var circlePoint = new OpenLayers.Geometry.Point(Math.cos(radians)*radius + centerPoint.x, Math.sin(radians) * radius + centerPoint.y);
                    points[i] = circlePoint;
                }
                
                this.components.push(new OpenLayers.Geometry.LinearRing(points));
            }
        }
    })
    
    return Circle;
})