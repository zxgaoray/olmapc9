define('test/drawn/util/plot/shape/GeoRectangle',
[
    'test/drawn/util/plot/shape/GeoPlot'
],
function(GeoPlot){
    var GeoRectangle = OpenLayers.Class(GeoPlot, {
        initialize : function() {
            GeoPlot.prototype.initialize.apply(this, arguments);
        }
        , clone : function(){
            var geoRectFlag =new GeoRectangle();
            var controlPoints = [];
            
            for(var i = 0, len = this._controlPoints.length; i<len; i++)
            {
                controlPoints.push(this._controlPoints[i].clone());
            }
            geoRectFlag._controlPoints = controlPoints;
            return geoRectFlag;
        }
        , calculateParts : function() {
            this.components = [];
            
            if (this._controlPoints.length > 1) {
                var startPoint = this._controlPoints[0];
                var endPoint = this._controlPoints[this._controlPoints.length - 1];
                
                var point1 = startPoint.clone();
                var point2 = new OpenLayers.Geometry.Point(endPoint.x, startPoint.y);
                var point3 = endPoint.clone();
                var point4 = new OpenLayers.Geometry.Point(startPoint.x, endPoint.y);
                
                this.components.push(new OpenLayers.Geometry.LinearRing([point1, point2, point3, point4]));
            }
        }
    });
    
    return GeoRectangle;
})