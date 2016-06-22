define('test/drawn/util/plot/shape/GeoPlot',
[
],
function(){
    var GeoPlot = OpenLayers.Class(OpenLayers.Geometry.Polygon, {
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
        , calculateVector : function(v, a, d) {
            if(!a) a =  Math.PI/2;
            if(!d) d = 1;

            //定义目标向量的头部   x 坐标
            var x_1;
            var x_2;
            //定义目标向量的头部   y 坐标
            var y_1;
            var y_2;
            //定义目标向量，一左一右
            var v_l;
            var v_r;

            //计算基准向量v的模
            var d_v = Math.sqrt(v.x*v.x+v.y*v.y);

            //基准向量的斜率为0时，y值不能作为除数，所以需要特别处理
            if(v.y == 0)
            {
                //计算x,会有两个值
                x_1 = x_2 = d_v*d*Math.cos(a)/v.x;
                //根据v.x的正负判断目标向量的左右之分
                if(v.x>0)
                {
                    //计算y
                    y_1 = Math.sqrt(d*d-x_1*x_1);
                    y_2 = -y_1;
                }
                else if(v.x<0)
                {
                    //计算y
                    y_2 = Math.sqrt(d*d-x_1*x_1);
                    y_1 = -y_2;
                }
                v_l = new SuperMap.Geometry.Point(x_1,y_1);
                v_r = new SuperMap.Geometry.Point(x_2,y_2);
            }
            //此为大多数情况
            else
            {
                //转换为y=nx+m形式
                var n = -v.x/v.y;
                var m = d*d_v*Math.cos(a)/v.y;
                //
                //x*x + y*y = d*d
                //转换为a*x*x + b*x + c = 0
                var a = 1+n*n;
                var b = 2*n*m;
                var c = m*m - d*d;
                //计算x,会有两个值
                x_1 = (-b - Math.sqrt(b*b-4*a*c))/(2*a);
                x_2 = (-b + Math.sqrt(b*b-4*a*c))/(2*a);
                //计算y
                y_1 = n*x_1 + m;
                y_2 = n*x_2 + m;
                //当向量向上时
                if(v.y>=0)
                {
                    v_l = new SuperMap.Geometry.Point(x_1,y_1);
                    v_r = new SuperMap.Geometry.Point(x_2,y_2);
                }
                //当向量向下时
                else if(v.y<0)
                {
                    v_l = new SuperMap.Geometry.Point(x_2,y_2);
                    v_r = new SuperMap.Geometry.Point(x_1,y_1);
                }
            }
            return [v_l,v_r];
        }
        , calculateIntersection : function() {}
        , calculateAngularBisector : function() {}
        , calculateIntersectionFromTwoCorner : function() {}
        , calculateDistance : function(pointA, pointB){
            var distance =Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
            return distance;
        }
        , calculateArc : function(center, radius, startAngle, endAngle, direction, sides){
            if(!direction ||(direction!=1 && direction!=-1)) direction=-1;
            if(!sides) sides=360;
            var step=Math.PI/sides/2;
            var stepDir= step*direction;
            var length=Math.abs(endAngle-startAngle);
            var points=[];
            for(var radians =startAngle,i = 0; i <length;i+=step)
            {
                var circlePoint = new OpenLayers.Geometry.Point(Math.cos(radians) * radius + center.x, Math.sin(radians) * radius + center.y);
                points.push(circlePoint);
                radians+=stepDir;
                radians=radians<0?(radians+2*Math.PI):radians;
                radians=radians> 2*Math.PI?(radians-2*Math.PI):radians;

            }
            return points;
        }
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
    
    return GeoPlot;
})