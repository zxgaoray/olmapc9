define('test/staticmap/util/GeoCircle',
[
    'OpenLayers'
],
function(OpenLayers){
    var GeoPlotting = OpenLayers.Class(OpenLayers.Geometry.Polygon, {
        _controlPoints : []
        , initialize : function(points) {
            OpenLayers.Geometry.Polygon.prototype.initialize.apply(this, arguments);
            this._controlPoints = points;
            
            if (points && points.length > 0) {
                this.calculateParts();
            }
        }
        , getControlPoints : function() {
            return this._controlPoints;
        }
        , setControlPoints : function() {
            if(points && points.length && points.length > 0){
                this._controlPoints = points;
                this.calculateParts();
            }
        }
        , calculateMidPoint : function(pointA, pointB) {
            var midPoint = new OpenLayers.Geometry.Point((pointA.x + pointB.x)/2, (pointA.y + pointB.y)/2);
            return midPoint;
        }
        , calculateParts : function() {}
        , calculateVector : function() {}
        , calculateIntersection : function() {}
        , calculateAngularBisector : function() {}
        , calculateIntersectionFromTwoCorner : function() {}
        , calculateDistance : function(){}
        , calculateArc : function(){}
        , cloneControlPoints: function(cp){
            var controlPoints = [];

            for(var i = 0; i < cp.length; i++){
                controlPoints.push(cp[i].clone());
            }
            return controlPoints;
        }
        , clone: function(){
            var geoState = new GeoPlotting();
            var controlPoints = [];
            //赋值控制点
            for(var i = 0, len = this._controlPoints.length; i<len; i++)
            {
                //这里必须深赋值，不然在编辑时由于引用的问题出现错误
                controlPoints.push(this._controlPoints[i].clone());
            }
            geoState._controlPoints = controlPoints;
            return geoState;
        }
    })
    
    var GeoCircle = OpenLayers.Class(GeoPlotting, {
        initialize : function() {
            GeoPlotting.prototype.initialize.apply(this, arguments);
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
    
    return GeoCircle;
})