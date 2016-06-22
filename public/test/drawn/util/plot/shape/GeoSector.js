define('test/drawn/util/plot/shape/GeoSector',
[
    'test/drawn/util/plot/shape/GeoPlot'
],
function(GeoPlot){
    var GeoSector = OpenLayers.Class(GeoPlot, {
        direction : -1
        , initialize : function() {
            GeoPlot.prototype.initialize.apply(this, arguments);
        }
        , calculateParts : function() {
            var controlPoints = this.cloneControlPoints(this._controlPoints);
            
            this.components = [];

            
            if (controlPoints.length == 2) {
                var pointA = controlPoints[0];
                var pointB = controlPoints[1];
                
                this.components.push(new OpenLayers.Geometry.LinearRing([pointA, pointB]));
            }
            
            if (controlPoints.length > 2) {
                var centerPoint = controlPoints[0];
                
                var pointR = controlPoints[1];
                
                var pointC = controlPoints[controlPoints.length - 1];
                
                var radius = this.calculateDistance(centerPoint, pointR);
                
                var angleR = this.calculateAngle(pointR, centerPoint);
                var angleC = this.calculateAngle(pointC, centerPoint);
                
                //anti clockwise
                if (this.direction == 1 && angleC < angleR) {
                    angleC = 2 * Math.PI + angleC;
                }
                
                //clockwise
                if (this.direction == -1 && angleC > angleR) {
                    angleC = -(2 * Math.PI - angleC);
                }
                
                var points = this.calculateArc(centerPoint, radius, angleR, angleC, this.direction);
                points.unshift(centerPoint);
                console.log(points);
                this.components.push(new OpenLayers.Geometry.LinearRing(points));
            }
        }
        , calculateAngle : function(pointA, centerPoint) {
            var angle = Math.atan2((pointA.y - centerPoint.y), (pointA.x - centerPoint.x));
            if (angle < 0) {
                angle += 2*Math.PI;
            }
            return angle;
        }
    })
    
    return GeoSector;
})