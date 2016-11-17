define('olext/layer/BaiduTiledLayer2',
[
    'OpenLayers'
],
function(OpenLayers){
    /*
* 
* 投影系：EPSG:4326
* 切图原点：(0,0)
* 切图分辨率：[2，2\2，……，2\(2^index)]
* 切图方向：从西到东，从南到背 
*/
    var BaiduTiledLayer2 = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    
        /**
        * 备用地址
        */
        backServer: [],
        /**
        * 构造方法
        * @param name 图层名
        * @param url 地址格式串
        * @param options 其他参数
        */
        initialize: function (name, url, options) {
            var newArguments = [];
            newArguments.push(name, url, options);
            OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArguments);
            this.projection = new OpenLayers.Projection("EPSG:4326");
        },
        /**
        * 获取url
        * @param bounds
        * @returns {String}
        */
        getURL: function (bounds) {
            var z = this.getServerZoom();
    
            bounds = this.adjustBounds(bounds); 
            var res = this.getServerResolution();
    
            var x = Math.round((bounds.left) / (res * this.tileSize.w));
            var y = Math.round((bounds.bottom) / (res * this.tileSize.h)); 
            var url = this.url;
            if (x < 0) {
                url = url.replace("{$ X}", "M{$ X}");
            }
            if (y < 0) {
                url = url.replace("{$ Y}", "M{$ Y}");
            }
            if (url) {
                url = url.replace("{$ X}", Math.abs(x)).replace("{$ Y}", Math.abs(y)).replace("{$ Z}", z);
                if (this.backServer && this.backServer.length > 0) {
                    url = url.replace("{$ B}", this.backServer[(x + y + z) % this.backServer.length]);
                }
            } 
            return url;
    
        },
        setMap: function (map) {
            this.tileSize = new OpenLayers.Size(301.404741209, 293.6741169);
            OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
            this.maxExtent = new OpenLayers.Bounds(-180, -90, 180, 90);
            this.projection = new OpenLayers.Projection("EPSG:4326");
            this.resolutions = [2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125, 0.00390625, 0.001953125, 0.0009765625, 0.00048828125, 0.000244140625, 0.0001220703125, 0.00006103515625, 0.000030517578125, 0.0000152587890625, 0.00000762939453125, 0.000003814697265625, 0.0000019073486328125, 9.5367431640625e-7, 4.76837158203125e-7];
            this.tileOrigin = new OpenLayers.LonLat(0, 0);
        },
        /*
        *
        *重写 grid.getTilesBounds,转化900913到4326解决，漫游结束后闪屏的问题
        **/
        getTilesBounds: function () {
            var bounds = null;
    
            var length = this.grid.length;
            if (length) {
                var bottomLeftTileBounds = this.grid[length - 1][0].bounds,
                    width = this.grid[0].length * bottomLeftTileBounds.getWidth(),
                    height = this.grid.length * bottomLeftTileBounds.getHeight();
    
                bounds = new OpenLayers.Bounds(bottomLeftTileBounds.left,
                                               bottomLeftTileBounds.bottom,
                                               bottomLeftTileBounds.left + width,
                                               bottomLeftTileBounds.bottom + height);
            }
            /*
            if (bounds) {
            return this.get4326Bounds(bounds);
            }
            }*/
            return bounds;
    
        },
        initGriddedTiles: function (bounds) {
            return this.myInitGriddedTiles(bounds);
        },
        /*
        *
        *
        *        针对以左下角为切图原点，从左到右从下到上的切图方式重写initGriddedTiles方法，原始方法的切图方向是从左到右，从上到下
        */
        myInitGriddedTiles: function (bounds) {
            //this.clearTileQueue();
            var viewSize = this.map.getSize();
            var resolution = this.getServerResolution();
    
            //最小行数
            var minRows = Math.ceil(viewSize.h / this.tileSize.h) +
                                    Math.max(1, 2 * this.buffer);
            var minCols = Math.ceil(viewSize.w / this.tileSize.w) +
                                    Math.max(1, 2 * this.buffer);
    
            var tileLayout = this.myCalculateGridLayout(bounds, resolution);
    
            var tileoffsetx = Math.round(tileLayout.tileoffsetx);
            //左下角第一张瓦片底部相对于map div y像素坐标差, 小于0
            var tileoffsety = Math.round(tileLayout.tileoffsety);
    
            var tileoffsetlon = tileLayout.tileoffsetlon;
            //左下角第一张瓦片右下角y坐标
            var tileoffsetlat = tileLayout.tileoffsetlat;
    
            var tilelon = tileLayout.tilelon;
            var tilelat = tileLayout.tilelat;
    
            var startX = tileoffsetx;
    
            var startLon = tileoffsetlon;
    
            var rowidx = 0;
            //图层容器相对于地图容器的像素坐标
            var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
    
            var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);
    
            var tileData = [],
                            center = this.map.getCenter();
            do {
                var row = this.grid[rowidx++];
                if (!row) {
                    row = [];
                    this.grid.push(row);
                }
    
                tileoffsetlon = startLon;
                tileoffsetx = startX;
                var colidx = 0;
    
                do {
                    var tileBounds =
                                                    new OpenLayers.Bounds(tileoffsetlon, tileoffsetlat, tileoffsetlon + tilelon, tileoffsetlat + tilelat);
    
                    var x = tileoffsetx;
                    x -= layerContainerDivLeft;
                    //x += 140.5273632813 * 0.125 / resolution;
                    //通过瓦片底部y像素坐标计算出顶部y像素坐标
                    var y = viewSize.h - tileoffsety - this.tileSize.h;
                    y -= layerContainerDivTop;
                    //y -= 24.8046875 * 0.125 / resolution;
                    var px = new OpenLayers.Pixel(x, y);
                    var tile = row[colidx++];
                    if (!tile) {
                        tile = this.addTile(tileBounds, px);
                        this.addTileMonitoringHooks(tile);
                        row.push(tile);
                    } else {
                        tile.moveTo(tileBounds, px, false);
                    }
                    var tileCenter = tileBounds.getCenterLonLat();
                    tileData.push({
                        tile: tile,
                        distance: Math.pow(tileCenter.lon - center.lon, 2) +
                                                    Math.pow(tileCenter.lat - center.lat, 2)
                    });
    
                    tileoffsetlon += tilelon;
                    tileoffsetx += this.tileSize.w;
                } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                                             || colidx < minCols);
    
                tileoffsetlat += tilelat;
                tileoffsety += this.tileSize.h;
            } while ((tileoffsetlat <= bounds.top + tilelat * this.buffer)
                                     || rowidx < minRows);
    
            this.removeExcessTiles(rowidx, colidx);
    
            this.gridResolution = this.getServerResolution();
    
            tileData.sort(function (a, b) {
                return a.distance - b.distance;
            });
            for (var i = 0, ii = tileData.length; i < ii; ++i) {
                
                if (tileData[ii] && [ii]['tile']){
                    tileData[ii].tile.draw();    
                }
            }
        },
        /*
        *
        *
        *        针对以左下角为切图原点，从左到右从下到上的切图方式重写calculateGridLayout方法，原始方法的切图方向是从左到右，从上到下
        */
        myCalculateGridLayout: function (bounds, resolution) {
            //切图原点
            var origin = {
                lon: 0,
                lat: 0
            };
            //该分辨率下，一个瓦片的经度跨度
            var tilelon = resolution * this.tileSize.w;
            var tilelat = resolution * this.tileSize.h;
    
            var offsetlon = bounds.left - origin.lon;
            var tilecol = Math.floor(offsetlon / tilelon) - this.buffer;
            var tilecolremain = offsetlon / tilelon - tilecol;
            //左下角第一张瓦片相对于地图div的x像素坐标
            var tileoffsetx = -tilecolremain * this.tileSize.w;
            var tileoffsetlon = origin.lon + tilecol * tilelon;
            //视图底部和切图原点的纬度距离
            var offsetlat = bounds.bottom - origin.lat;
            //左下角第一张瓦片的行索引
            var tilerow = Math.floor(offsetlat / tilelat) - this.buffer;
    
            var tilerowremain = offsetlat / tilelat - tilerow;
            //左下角第一张瓦片底部相对于地图div y像素坐标差,小于0
            var tileoffsety = -tilerowremain * this.tileSize.h;
            //左下角第一张瓦片右下角y坐标
            var tileoffsetlat = origin.lat + tilerow * tilelat;
    
            return {
                tilelon: tilelon,
                tilelat: tilelat,
                tileoffsetlon: tileoffsetlon,
                tileoffsetlat: tileoffsetlat,
                tileoffsetx: tileoffsetx,
                tileoffsety: tileoffsety
            };
        },
    
        clone: function (obj) {
    
            if (obj == null) {
                obj = new BaiduTiledLayer2(this.name,
                                                    this.url,
                                                    this.getOptions());
            }
    
            obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
            return obj;
        },
        CLASS_NAME: "olext.layer.BaiduTiledLayer2"
    });
    
    return BaiduTiledLayer2;
})