define('test/drawn/util/plot/shape/GeoPlot',
[
    'OpenLayers'
],
function(OpenLayers){
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
        , setControlPoint : function(points) {
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
                v_l = new OpenLayers.Geometry.Point(x_1,y_1);
                v_r = new OpenLayers.Geometry.Point(x_2,y_2);
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
                    v_l = new OpenLayers.Geometry.Point(x_1,y_1);
                    v_r = new OpenLayers.Geometry.Point(x_2,y_2);
                }
                //当向量向下时
                else if(v.y<0)
                {
                    v_l = new OpenLayers.Geometry.Point(x_2,y_2);
                    v_r = new OpenLayers.Geometry.Point(x_1,y_1);
                }
            }
            return [v_l,v_r];
        }
        , calculateIntersection : function() {
            //定义交点的坐标
            var x;
            var y;
            //如果向量v_1和v_2平行
            if(v_1.y*v_2.x-v_1.x*v_2.y == 0)
            {
                //平行也有两种情况
                //同向
                if(v_1.x*v_2.x>0 || v_1.y*v_2.y>0)
                {
                    //同向直接取两个点的中点
                    x = (point1.x+point2.x)/2;
                    y = (point1.y+point2.y)/2;
                }
                //反向
                else
                {
                    //如果反向直接返回后面的点位置
                    x = point2.x;
                    y = point2.y;
                }
            }
            else
            {
                //
                x = (v_1.x*v_2.x*(point2.y-point1.y)+point1.x*v_1.y*v_2.x-point2.x*v_2.y*v_1.x)/(v_1.y*v_2.x-v_1.x*v_2.y);
                if(v_1.x!=0)
                {
                    y = (x-point1.x)*v_1.y/v_1.x+point1.y;
                }
                //不可能v_1.x和v_2.x同时为0
                else
                {
                    y = (x-point2.x)*v_2.y/v_2.x+point2.y;
                }
            }
            return new OpenLayers.Geometry.Point(x,y);
        }
        , calculateAngularBisector : function(v1, v2) {
            //计算角平分线的思想是取两个向量的单位向量，然后相加
            var d1 = Math.sqrt(v1.x*v1.x+v1.y*v1.y);
            var d2 = Math.sqrt(v2.x*v2.x+v2.y*v2.y);
            return new OpenLayers.Geometry.Point(v1.x/d1+v2.x/d2,v1.y/d1+v2.y/d2);
        }
        , calculateIntersectionFromTwoCorner : function(pointS, pointE, a_S, a_E) {
            if(!a_S) a_S = Math.PI/4;
            if(!a_E) a_E = Math.PI/4;

            //起始点、结束点、交点加起来三个点，形成一个三角形
            //斜边（起始点到结束点）的向量为
            var v_SE = new OpenLayers.Geometry.Point(pointE.x-pointS.x,pointE.y-pointS.y);
            //计算起始点、交点的单位向量
            var v_SI_lr = this.calculateVector(v_SE,a_S,1);
            //获取
            var v_SI_l = v_SI_lr[0];
            var v_SI_r = v_SI_lr[1];
            //计算结束点、交点的单位向量
            var v_EI_lr = this.calculateVector(v_SE,Math.PI-a_S,1);
            //获取
            var v_EI_l = v_EI_lr[0];
            var v_EI_r = v_EI_lr[1];
            //求左边的交点
            var pointI_l = this.calculateIntersection(v_SI_l,v_EI_l,pointS,pointE);
            //计算右边的交点
            var pointI_r = this.calculateIntersection(v_SI_r,v_EI_r,pointS,pointE);
            return [pointI_l,pointI_r];
        }
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
            var geoState = new GeoPlot();
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