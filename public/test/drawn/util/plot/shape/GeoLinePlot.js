define('test/drawn/util/shape/GeoLinePlot',
[
],
function(){
    var GeoLinePlot = OpenLayers.Class(OpenLayers.Geometry.LineString, {
        _controlPoints : []
        , initialize : function(points) {
            OpenLayers.Geometry.LineString.prototype.apply(this, arguments);
            
            this._controlPoints = points;
            
            if (points && points.length > 0) {
                this.calculateParts();
            }
        }
        , getArea : function() {
            var area = 0.0;
            if (this.components && (this.components.length > 0)) {
                area += Math.abs(this.components[0].getArea());
                
                for (var i=1, len = this.components.length; i < len; i++) {
                    area -= Math.abs(this.components[i].getArea());
                }
            }
            
            return area;
        }
        , getControlPoints : function() {
            return this._controlPoints;
        }
        , setControlPoint : function(points) {
            if (points && points.length && points.length > 0) {
                this._controlPoints = points;
                
                this.calculateParts();
            }
            
        }
        , clone : function() {
            var geoState = new GeoLinePlot();
            var controlPoints = [];
            
            for (var i=0; len = this.controlPoints.length; i<len; i++) {
                controlPoints.push(this._controlPoints[i].clone());
            }
            
            geoState._controlPoints = controlPoints;
            return geoState;
        }
        , calculateParts : function() {}
        , calculateMidPoint : function(pA, pB) {
            var mp = new OpenLayers.Geomerty.Point((pA.x + pB.x) / 2, (pA.y + pB.y) / 2);
            return mp;
        }
        , calculateDistance : function(pA, pB) {
            var d = Math.sqrt(Math.pow(pA.x - pB.x, 2) + Math.pow(pA.y - pB.y, 2));
            return d;
        }
        , toVector : function(pA, pB) {
            return new OpenLayers.Geometry.Point(pA.x - pB.x, pA.y - pB.y);
        }
        , calculateVector : function(v, a, d) {
            
        }
        , calculateIntersection : function(v1, v2, p1, p2) {
            
        }
        , calculateAngularBisector : function(v1, v2) {
            var d1 = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
            var d2 = Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2));
            return new OpenLayers.Geometry.Point(v1.x/d1 + v2.x/d2, v1.y/d1 + v2.y / d2);
        }
        , calculateIntersectionFromTwoCorner : function(pS, pE, aS, aE) {
            
        }
        , cloneControlPoints : function(cp) {
            var controlPoints = [];
            
            for (var i=0; i < cp.length; i++) {
                controlPoints.push(cp[i].clone());
            }
            
            return controlPoints;
        }
    })
    
    return GeoLinePlot;
})