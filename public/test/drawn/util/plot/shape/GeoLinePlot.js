define('test/drawn/util/plot/shape/GeoLinePlot',
[
    'OpenLayers'
],
function(OpenLayers){
    var GeoLinePlot = OpenLayers.Class(OpenLayers.Geometry.LineString, {
        _controlPoints : []
        , initialize : function(points) {
            OpenLayers.Geometry.LineString.prototype.initialize.apply(this, arguments);
            
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
            
            for (var i=0, len = this.controlPoints.length; i<len; i++) {
                controlPoints.push(this._controlPoints[i].clone());
            }
            
            geoState._controlPoints = controlPoints;
            return geoState;
        }
        , calculateParts : function() {}
        , calculateMidPoint : function(pA, pB) {
            var mp = new OpenLayers.Geometry.Point((pA.x + pB.x) / 2, (pA.y + pB.y) / 2);
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
            if (!a) a = Math.PI / 2;
            if (!d) d = 1;

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
            var d_v = Math.sqrt(v.x * v.x + v.y * v.y);

            //基准向量的斜率为0时，y值不能作为除数，所以需要特别处理
            if (v.y == 0) {
                //计算x,会有两个值
                x_1 = x_2 = d_v * d * Math.cos(a) / v.x;
                //根据v.x的正负判断目标向量的左右之分
                if (v.x > 0) {
                    //计算y
                    y_1 = Math.sqrt(d * d - x_1 * x_1);
                    y_2 = -y_1;
                }
                else if (v.x < 0) {
                    //计算y
                    y_2 = Math.sqrt(d * d - x_1 * x_1);
                    y_1 = -y_2;
                }
                v_l = new OpenLayers.Geometry.Point(x_1, y_1);
                v_r = new OpenLayers.Geometry.Point(x_2, y_2);
            }
            //此为大多数情况
            else {
                //转换为y=nx+m形式
                var n = -v.x / v.y;
                var m = d * d_v * Math.cos(a) / v.y;
                //
                //x*x + y*y = d*d
                //转换为a*x*x + b*x + c = 0
                var a = 1 + n * n;
                var b = 2 * n * m;
                var c = m * m - d * d;
                //计算x,会有两个值
                x_1 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
                x_2 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
                //计算y
                y_1 = n * x_1 + m;
                y_2 = n * x_2 + m;
                //当向量向上时
                if (v.y >= 0) {
                    v_l = new OpenLayers.Geometry.Point(x_1, y_1);
                    v_r = new OpenLayers.Geometry.Point(x_2, y_2);
                }
                //当向量向下时
                else if (v.y < 0) {
                    v_l = new OpenLayers.Geometry.Point(x_2, y_2);
                    v_r = new OpenLayers.Geometry.Point(x_1, y_1);
                }
            }
            return [v_l, v_r];
        }
        , calculateIntersection : function(v_1, v_2, point1, point2) {
            //定义交点的坐标
            var x;
            var y;
            //如果向量v_1和v_2平行
            if (v_1.y * v_2.x - v_1.x * v_2.y == 0) {
                //平行也有两种情况
                //同向
                if (v_1.x * v_2.x > 0 || v_1.y * v_2.y > 0) {
                    //同向直接取两个点的中点
                    x = (point1.x + point2.x) / 2;
                    y = (point1.y + point2.y) / 2;
                }
                //反向
                else {
                    //如果反向直接返回后面的点位置
                    x = point2.x;
                    y = point2.y;
                }
            }
            else {
                //
                x = (v_1.x * v_2.x * (point2.y - point1.y) + point1.x * v_1.y * v_2.x - point2.x * v_2.y * v_1.x) / (v_1.y * v_2.x - v_1.x * v_2.y);
                if (v_1.x != 0) {
                    y = (x - point1.x) * v_1.y / v_1.x + point1.y;
                }
                //不可能v_1.x和v_2.x同时为0
                else {
                    y = (x - point2.x) * v_2.y / v_2.x + point2.y;
                }
            }
            return new OpenLayers.Geometry.Point(x, y);
        }
        , calculateAngularBisector : function(v1, v2) {
            var d1 = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
            var d2 = Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2));
            return new OpenLayers.Geometry.Point(v1.x/d1 + v2.x/d2, v1.y/d1 + v2.y / d2);
        }
        , calculateIntersectionFromTwoCorner : function(pointS, pointE, a_S, a_E) {
            if (!a_S) a_S = Math.PI / 4;
            if (!a_E) a_E = Math.PI / 4;

            //起始点、结束点、交点加起来三个点，形成一个三角形
            //斜边（起始点到结束点）的向量为
            var v_SE = new OpenLayers.Geometry.Point(pointE.x - pointS.x, pointE.y - pointS.y);
            //计算起始点、交点的单位向量
            var v_SI_lr = this.calculateVector(v_SE, a_S, 1);
            //获取
            var v_SI_l = v_SI_lr[0];
            var v_SI_r = v_SI_lr[1];
            //计算结束点、交点的单位向量
            var v_EI_lr = this.calculateVector(v_SE, Math.PI - a_S, 1);
            //获取
            var v_EI_l = v_EI_lr[0];
            var v_EI_r = v_EI_lr[1];
            //求左边的交点
            var pointI_l = this.calculateIntersection(v_SI_l, v_EI_l, pointS, pointE);
            //计算右边的交点
            var pointI_r = this.calculateIntersection(v_SI_r, v_EI_r, pointS, pointE);
            return [pointI_l, pointI_r];
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