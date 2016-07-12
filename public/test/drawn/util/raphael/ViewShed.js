define('test/drawn/util/raphael/ViewShed',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'OpenLayers'
    , 'raphael'
],
function($, _, Backbone, OpenLayers, Raphael){
    var ViewShed = Backbone.View.extend({
        isGradient : false
        , initialize:function(map, layer, options){
            this.option = {
                fields : {
                    fid : 'fid'
                    , name : 'name'
                    , ftype : 'type'
                    , startColor : 'startColor'
                    , endColor : 'endColor'
                    , lon : 'lon'
                    , lat : 'lat'
                    , centerAngle : 'centerAngle'
                    , sectorRadius : 'sectorRadius'
                    , flareAngle : 'flareAngle'
                    , rotateDirection : 'rotateDirection'
                    , growClockwise : 'growClockwise'
                }
                , defaultValue : {
                    fid : ''
                    , name : ''
                    , ftype : ''
                    , startColor : 'rgb()'
                    , endColor : 'rgb()'
                    , lon : 120
                    , lat : 30
                    , centerAngle : 0
                    , sectorRadius : 0
                    , flareAngle : 0
                    , rotateDirection : true
                    , growClockwise : true
                    
                }
            };
            
            _.extend(this.option, options);
            
            var map = this.map = map;
            var ollayer = this.ollayer = layer;
            
            var lid = this.ollayer.id;
            var mapSize = this.map.getSize();
            var paper = this.drawContext = Raphael(lid, mapSize.w * ollayer.ratio, mapSize.h * ollayer.ratio);
            
            switch(Raphael.type) {
                case 'VML':
                    this.rendererType = 1;
                    break;
                case 'SVG':
                    this.rendererType = 2;
                    break;
                case 'canvas':
                    this.rendererType = 3;
                    break;
                case 'webGL':
                    this.rendererType = 4;
                    break;
                default:
                    this.rendererType = 2;
                    break;
            }
            
            if (paper && map) {
                var self = this;
                
                map.events.register('updatesize', this, this._onMapUpdateSize);
                map.events.register('movestart', this, this._onMapMoveStart);
                map.events.register('moveend', this, this._onMapMoveEnd);
                map.events.register('zoomstart', this, this._onMapZoomStart);
                map.events.register('zoomend', this, this._onMapZoomEnd);
            }
        }
        , setOptions : function() {
            
        }
        , replaceOptions : function() {
            
        }
        , setDataSource : function(ds) {
            if (_.isArray) {
                this.dataSource = ds;
                this._redraw();
            }
        }
        , redraw : function() {
            
        }
        , getFeature : function() {
            
        }
        , getFeatureById : function() {
            
        }
        , _draw : function() {
            var ctx = this.drawContext,
                dataSource = this.dataSource;
                
            if (dataSource.length === 0) return;
            
            var o = this.option
                , fs = o.fields
                , odf = o.defaultValue
                , _fid = fs['fid']
                , _name = fs['name']
                , _startColor = fs['startColor']
                , _endColor = fs['endColor']
                , _lon = fs['lon']
                , _lat = fs['lat']
                , _centerAngle = fs['centerAngle']
                , _sectorRadius = fs['sectorRadius']
                , _flareAngle = fs['flareAngle']
                , _rotateDirection = fs['rotateDirection'];
                
                for (var i=0; i < dataSource.length; i++) {
                    var item = dataSource[i];
                    item[_uuid] ? 0 : item[_uuid] = odf['uuid'];
                    item[_startColor] ? 0 : item[_startColor] = odf['startColor'];
                    item[_startColor] ? 0 : item[_startColor] = odf['startColor'];
                    item[_endColor] ? 0 : item[_endColor] = odf['endColor'];
                    item[_lon] ? 0 : item[_lon] = odf['lon'];
                    item[_lat] ? 0 : item[_lat] = odf['lat'];
                    item[_centerAngle] ? 0 : item[_centerAngle] = odf['centerAngle'];
                    item[_sectorRadius] ? 0 : item[_sectorRadius] = odf['sectorRadius'];
                    item[_flareAngle] ? 0 : item[_flareAngle] = odf['flareAngle'];
                    item[_rotateDirection] ? 0 : item[_rotateDirection] = odf['rotateDirection'];
                
                    this._drawGraphic(item);
                }
                
        }
        , _redraw : function() {
            var ctx = this.drawContext;
            
            ctx.clear();
            this.graphics = [];
            
            this._draw();
        }
        , _drawGraphic: function(item) {
            var ctx = this.drawContext
                , o = this.option
                , rendererType = this.rendererType
                , _fid = fs['fid']
                , _name = fs['name']
                , _startColor = fs['startColor']
                , _endColor = fs['endColor']
                , _lon = fs['lon']
                , _lat = fs['lat']
                , _originCenterAngle = fs['originCenterAngle']
                , _rotateDirection = fs['rotateDirection']
                , graphic
                , lon = item[_lon]
                , lat = item[_lat]
                , originCenterAngle = item[_originCenterAngle]
                , rotateDirection = item[_rotateDirection]
                , originScreenXY = this._calculateOriginScreenXY(lon, lat)
                , path = this._calculatePath(item, originScreenXY);
            
            graphic = ctx.path(path);
            graphic.data({
                'originScreenXY':originScreenXY
                , 'uuid':item.uuid
                , 'originCenterAngle':originCenterAngle
                , 'rotateDirection':rotateDirection
            })
            
            (originCenterAngle < 0) ? (originCenterAngle=360-originCenterAngle) : 0;
            
            var fillStr = '';
            fillStr = ( this.isGradient ) ? ( originCenterAngle + '-' + item[startColor] + '-' + item[endColor] ) : ( originCenterAngle + '-' + item[startColor] );
            
            switch (rendererType) {
                case 1:
                    graphic.attr({
                        'stroke' : 'none'
                        , 'fill-opacity' : 0.2
                        , 'fill' : fillStr
                    });
                    break;
                case 2:
                    graphic.attr({
                        'stroke' : 'none'
                        , 'fill' : fillStr
                    });
                    $(graphic.node).css({
                        'fill-opacity' : 0.6
                    });
                    break;
                default:
                    // code
                    break;
            }
            
            var self = this;
            $(graphic.node).attr({
                'guuid':item.uuid
            });
            
            $(graphic.node).off('click').click(function(e){
                
            })
            
            this.graphics.push(graphic);
        }
        , _redrawGraphic : function(g, item) {
            var ctx = this.drawContext,
                o = this.option
                , fs = o.fields
                , _fid = fs['fid']
                , _name = fs['name']
                , _startColor = fs['startColor']
                , _endColor = fs['endColor']
                , _lon = fs['lon']
                , _lat = fs['lat']
                , _originCenterAngle = fs['originCenterAngle']
                , _lastCenterAngle = fs['lastCenterAngle']
                , _rotateDirection = fs['rotateDirection']
                , graphic
                , lon = item[_lon]
                , lat = item[_lat]
                , originCenterAngle = item[_lastCenterAngle]
                , rotateDirection = item[_rotateDirection]
                , originScreenXY = this._calculateOriginScreenXY(lon, lat)
                , path = this._calculatePath(item, originScreenXY, true);
            
            g.attr('path', path);
        }
        , _calculateOriginScreenXY : function(lon, lat) {
            var map = this.map;
            var lonlat = new OpenLayers.LonLat(lon, lat);
            var pixel = map.getViewPortPxFromLonLat(lonlat);
            return pixel;
        }
        , _calculatePath : function(item, originScreenXY, last) {
            var o = this.option
    			//扇形半径
    			, sectorRadius = 'sectorRadius'
    			//中间线角度 
    			, centerAngle = 'centerAngle'
    			//张角 
    			, flareAngle = 'flareAngle'
    		
    			, lvlR = item[sectorRadius]
    			//中心线角度(逆时针)
    			, ca = item[centerAngle]
    			//半张角
    			, hfa = item [flareAngle] / 2
    			, x = originScreenXY.x
    			, y = originScreenXY.y;
    
    		//根据分辨率计算半径(设置指定的分辨率下 半径应该为多少)
    		var r = parseInt(lvlR / this.map.getResolution());
    
    		//扇形圆心
    		var M = 'M '+ parseInt(x) + ' ' + parseInt(y);
    		//左边线终点x,y
    		var L1Ex = parseInt(x + Math.cos((-(ca - hfa) + 90) * Math.PI/180) * r);
    		var L1Ey = parseInt(y - Math.sin((-(ca - hfa) + 90) * Math.PI/180) * r);
    
    		var L1 = 'L ' + L1Ex + ' ' + L1Ey;
    		//右边线起点x,y
    		var L2Sx = parseInt(x + Math.cos((-(ca + hfa) + 90) * Math.PI/180) * r);
    		var L2Sy = parseInt(y - Math.sin((-(ca + hfa) + 90) * Math.PI/180) * r);
    
    		//圆弧增量 arc delta x,y
    		var adx = parseInt(L2Sx - L1Ex);
    		var ady = parseInt(L2Sy - L1Ey);
    		var arc = 'a '+ r + ' ' + r + ' 0 0 1 ' + adx + ' ' + ady;
    		var L2Ex = parseInt(x);
    		var L2Ey = parseInt(y);
    		var L2 = 'L ' + L2Ex + ' ' + L2Ey;
    		var Z = ' Z';
    		
    		//路径
    		var path = M + L1 + arc + L2 + Z;
    		return path;
        }
        , _rotate : function(graphic, angle, delay, clockwise) {
            var self = this
                , o = this.option
                , dataSource = this.dataSource
                , originScreenXY = graphic.data('originScreenXY')
                , x = originScreenXY.x
                , y = originScreenXY.y
                , gidx = _.findIndex(dataSource, { uuid : graphic.data('uuid') })
                , item = dataSource[gidx]
                , centerAngle = item[lastCenterAngle] + (clockwise?angle*(-1):angle);
                
            (centerAngle < 0)?centerAngle=360+centerAngle : 0;
            
            var animation = Raphael.animation(
                    {
                        'transform':'r ' + ((clockwise)?angle:angle*(-1)) + ' ' + x + ' ' + y
                    },
                    delay,
                    'easing',
                    function(){
                        
                        self._redraw();
                    }
                )
        }
        , _uuid : function() {
            var uuidRegEx = /[xy]/g;
    		var uuidReplacer = function (c) {
    	        var r = Math.random() * 16 | 0,
    	            v = c == "x" ? r : (r & 3 | 8);
    	        return v.toString(16);
    	    };
    		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        }
        , _onMapUpdateSize : function() {
            
        }
        , _onMapMoveStart : function() {
            var map = this.map;
            this.__lastCenter = _.clone(this.map.center);
        }
        , _onMapMoveEnd : function() {
            var map = this.map
                , ctx = this.drawContext
                , graphics = this.graphics
                , lastCenter = this.__lastCenter
                , nowCenter = map.center
                , last = map.getViewPortPxFromLonLat(lastCenter)
                , now = map.getViewPortPxFromLonLat(nowCenter);
            
            var dX = now.x - last.x
                , dY = now.y - last.y;
            
            this._fetchData();
        }
        , _onMapZoomStart : function() {
            var map = this.map;
            this.__lastExtent = _.clone(map.getExtent());
        }
        , _onMapZoomEnd : function() {
            var map = this.map;
            var lE = this.__lastExtent;
            var nE = map.getExtent();
            this._fetchData();
        }
    })
    
    return ViewShed;
})