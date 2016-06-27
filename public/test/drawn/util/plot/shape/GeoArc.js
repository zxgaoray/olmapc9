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
            var controlPoints = this.cloneControlPoints(this._controlPoints);
            
            this.components = [];
            
            if (this._controlPoints.length < 3) {
                this.components = controlPoints;
            }
            
            if (this._controlPoints.length > 2) {
                var pA = controlPoints[0];
                var pB = controlPoints[1];
                var pC = controlPoints[2];
                
                // middle points
                var mpOfAB = this.calculateMidPoint(pA, pB);
                var mpOfBC = this.calculateMidPoint(pB, pC);
                
                //vectors
                var vOfAB = new OpenLayers.Geometry.Point(pB.x - pA.x, pB.y - pA.y);
                var vOfBC = new OpenLayers.Geometry.Point(pC.x - pB.x, pC.y - pB.y);
                
                //是否共线
                if (Math.abs(vOfAB.x * vOfBC.y - vOfBC.x * vOfAB.y) < 0.00001) {
                    this.components.push(pA, pC, pB);
                    return;
                }
                
                //中垂线
                var vector_center_mpOfAB = this.calculateVector(vOfAB)[1];
                var vector_center_mpOfBC = this.calculateVector(vOfBC)[1];
                
                var centerPoint = this.calculateIntersection(vector_center_mpOfAB, vector_center_mpOfBC, mpOfAB, mpOfBC);
                var radius = this.calculateDistance(centerPoint, pA);
                
                var angleA = this.calculateAngle(pA, centerPoint);
                var angleB = this.calculateAngle(pB, centerPoint);
                var angleC = this.calculateAngle(pC, centerPoint);
                
                var direction = 1
                    , startAngle = angleA
                    , endAngle = angleB
                    , startP
                    , endP;
                    
                if (angleA > angleB) {
                    startAngle = angleB;
                    endAngle = angleA;
                    startP = pB;
                    endP = pA;
                } else {
                    startP = pA;
                    endP = pB;
                }
                
                var length = endAngle - startAngle;
                
                if ((angleC < angleB && angleC < angleA) || (angleC > angleB && angleC > angleA)) {
                    direction = -1;
                    length = startAngle + (2 * Math.PI - endAngle);
                }
                
                var step = Math.PI / this.sides / 2;
                var stepDir = step * direction;
                this.components.push(startP);
                
                for (var radians = startAngle, i=0; i < length-step; i+=step) {
                    radians +=stepDir;
                    radians = radians < 0 ? (radians + 2*Math.PI) : radians;
                    radians = radians > 2* Math.PI ? (radians - 2*Math.PI) : radians;
                    
                    var circlePoint = new OpenLayers.Geometry.Point(Math.cos(radians) * radius + centerPoint.x, Math.sin(radians) * radius + centerPoint.y);
                    this.components.push(circlePoint);
                }
                
                this.components.push(endP);
                
            }   
                
            
        }
        , calculateAngle : function(pA, center) {
            var angle = Math.atan2((pA.y - center.y), (pA.x - center.x));
            
            if (angle < 0) {
                angle += 2*Math.PI;
            }
            
            return angle;
        }
    });
    
    return GeoArc;
})