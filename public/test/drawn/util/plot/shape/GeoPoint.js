define('test/drawn/util/plot/shape/GeoPoint',
[
    'OpenLayers'
],
function(OpenLayers){
    var GeoPoint = OpenLayers.Class(OpenLayers.Geometry.Point, {
        _controlPoints : []
        , initialize : function(point) {
            OpenLayers.Geometry.Point.prototype.initialize.apply(this, arguments);
            
            if (point && point instanceof OpenLayers.Geometry.Point) {
                this._controlPoints.push(point);
                this.calculateParts();
            }
        }
        , setControlPoint : function(point) {
            if (point && point instanceof OpenLayers.Geometry.Point) {
                this._controlPoints=[point];
                this.calculateParts();
            }
        }
        , getControlPoint : function() {
            return this._controlPoints[0];
        }
        , clone : function() {
            var geopoint = new GeoPoint();
            var controlPoints = [];
            
            controlPoints.push(this._controlPoints[0].clone());
            geopoint._controlPoints = controlPoints;
            return geopoint;
        }
        , calculateParts : function() {
            if (this._controlPoints.length > 0) {
                var point = this._controlPoints[0].clone();
                this.x = point.x;
                this.y = point.y;
            }
        }
    })
})