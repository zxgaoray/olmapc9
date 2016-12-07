//视图：地图
define('test/mario/view/MapView',
[
    'jquery',
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/util/ViewIdGenerator',
    'ol3',
    'test/mario/gis/TileParams'
],
function($, _, Backbone, Radio, Mn, Vig, ol, TileParams){
    var MapView = Mn.View.extend({
        initialize : function() {
            this.mid = Vig.generate();
        },
        templateContext : function() {
            return {
                mid : this.getOption('mid')
            }  
        },
        initMap : function(mapdiv) {
            var baseLayer = this._initBaseLayer('tdt-vec');
            var map = new ol.Map({
                //目标div
                target : mapdiv,
                renderer : 'canvas',
                //控制件
                controls : [],
                //图层
                layers: [
                    baseLayer
                ],
                //视图
                view : new ol.View({
                    center : ol.proj.fromLonLat([120.21844, 30.2096]),
                    zoom : 16,
                    projection : 'EPSG:3857'
                })
            });

            this.map = map;

            this._initBaseControl();

            this.map.addLayer(this._generateLayer('tdt-anno'));

            this.trigger('map-did-init');

            this._addVectorLayer();
        },
        //初始化底图
        _initBaseLayer : function (type) {
            return this._generateLayer(type);
        },
        //初始化切片图层
        _initTileLayer : function () {

        },
        //初始化graphic图层
        _initGraphicLayer : function () {

        },
        //初始化基础控制件
        _initBaseControl : function () {
            var scaleLine = new ol.control.ScaleLine();

            this.map.addControl(scaleLine);

        },
        //初始化控制件
        _initControl : function () {

        },
        _template : function() { 
            return '<div id="mainMap" class="map ngmap"></div>';
        },
        _generateLayer : function (type) {
            var lyr;
            switch (type) {
                case 'osm-vec' :
                    lyr = new ol.layer.Tile({
                        source: new ol.source.OSM()
                    });
                    break;
                case 'tdt-vec':
                case 'tdt-img':
                case 'tdt-ter':
                case 'tdt-anno':
                    var url = TileParams.tileURL(type);
                    console.log(url);
                    lyr = new ol.layer.Tile({
                        source : new ol.source.XYZ({
                            url : url
                        })
                    });
                    break;
                case 'gaode-vec' :
                    var url = TileParams.tileURL(type);
                    console.log(url);
                    lyr = new ol.layer.Tile({
                        source : new ol.source.XYZ({
                            url : url
                        })
                    });
                    break;
                default :
                    break;
            }

            return lyr;
        },
        _addVectorLayer : function () {
            var geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:4326'
                    }
                },
                'features': [{
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [120.21844, 30.2096]
                    }
                }]
            };

            /*
             {
             'type': 'Feature',
             'geometry': {
             'type': 'Point',
             'coordinates': [120.21844, 30.2096]
             }

             };
             */

            var image = new ol.style.Circle({
                radius: 5,
                fill: null,
                stroke: new ol.style.Stroke({color: 'red', width: 1})
            });

            var styles = {
                'Point': new ol.style.Style({
                    image: image
                })
            };
            var coord = ol.proj.fromLonLat([120.21844, 30.2096], "EPSG:3857");
            var feature = new ol.Feature(new ol.geom.Point(coord));
            function createStyle(src, img) {
                return new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 0.96],
                        src: src,
                        img: img,
                        imgSize: img ? [img.width, img.height] : undefined
                    }))
                });
            }
            feature.set('style', createStyle('https://openlayers.org/en/v3.19.1/examples/data/icon.png', undefined));
            console.log(feature.getGeometry().getCoordinates());


            var vectorLayer = new ol.layer.Vector({
                source : new ol.source.Vector(),
                style: function(feature) {
                    return feature.get('style');
                }
            });
            this.map.addLayer(vectorLayer);

            vectorLayer.getSource().addFeature(feature);
        }
    });
    
    return MapView;
})