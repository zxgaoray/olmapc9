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
            var baseLayer = this._initBaseLayer('gaode-vec');
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
                    zoom : 16
                })
            });

            this.map = map;

            this._initBaseControl();

            //this.map.addLayer(this._generateLayer('tdt-anno'));

            this.trigger('map-did-init');

            //加载wms服务
            this._addWmsLayer();

            //加载wfs
            this._addWfsLayer();

            //加载矢量图
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

            var mousePosition = new ol.control.MousePosition({
                undefinedHTML: '',
                projection: 'EPSG:4326',
                target : 'mouse-position',
                coordinateFormat: function(coordinate) {
                    return ol.coordinate.format(coordinate, '{x}, {y}', 4);
                }
            });
            this.map.addControl(mousePosition);

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
        },
        _addWmsLayer : function () {
            var wms = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: 'http://localhost:8080/geoserver/walrus/wms',
                    params: {'LAYERS': 'walrus:admreg_province'},
                    serverType: 'geoserver'
                })
            });

            this.map.addLayer(wms);
        },
        _addWfsLayer : function () {
            var vectorSource = new ol.source.Vector();
            var vector = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 255, 1.0)',
                        width: 2
                    })
                })
            });

            this.map.addLayer(vector);
            var map = this.map;

            // generate a GetFeature request
            /*
            var featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:3857',
                featureNS: 'http://openstreemap.org',
                featurePrefix: 'osm',
                featureTypes: ['water_areas'],
                outputFormat: 'application/json',
                filter: ol.format.ogc.filter.and(
                    ol.format.ogc.filter.like('name', 'Mississippi*'),
                    ol.format.ogc.filter.equalTo('waterway', 'riverbank')
                )
            });
            */

            // then post the request and add the received features to a layer
            /*
            fetch('https://ahocevar.com/geoserver/wfs', {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest)
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                var features = new ol.format.GeoJSON().readFeatures(json);
                vectorSource.addFeatures(features);
                map.getView().fit(vectorSource.getExtent(), (map.getSize()));
            });
            */

            var featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:3857',
                featureNS: 'http://127.0.0.1:8080/geoserver',
                featurePrefix: 'walrus',
                featureTypes: ['admreg_province'],
                outputFormat: 'application/json',
                filter: ol.format.ogc.filter.and(
                    ol.format.ogc.filter.like('admincode', '330*'),
                    ol.format.ogc.filter.equalTo('userid', 0)
                )
            });

            fetch('http://localhost:8080/geoserver/wfs', {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest)
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                var features = new ol.format.GeoJSON().readFeatures(json);
                vectorSource.addFeatures(features);
                //map.getView().fit(vectorSource.getExtent(), (map.getSize()));
            });

            //doit();

            function doit()
            {
                var url = 'http://localhost:8080/geoserver/wfs';
                var method = 'POST';
                var postData =
                    '<wfs:GetFeature\n'
                    + '  service="WFS"\n'
                    + '  version="1.0.0"\n'
                    + '  outputFormat="GML2"\n'
                    + '  xmlns:topp="http://www.openplans.org/topp"\n'
                    + '  xmlns:wfs="http://www.opengis.net/wfs"\n'
                    + '  xmlns:ogc="http://www.opengis.net/ogc"\n'
                    + '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
                    + '  xsi:schemaLocation="http://www.opengis.net/wfs\n'
                    + '  http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">\n'
                    + '  <wfs:Query typeName="topp:bc_roads">\n'
                    + '    <ogc:Filter>\n'
                    + '      <ogc:FeatureId fid="1"/>\n'
                    + '    </ogc:Filter>\n'
                    + '    </wfs:Query>\n'
                    + '</wfs:GetFeature>\n';
                var req = new XMLHttpRequest();
                req.open("POST", url, true);
                req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                req.onreadystatechange = function () {
                    if (req.readyState != 4) return;
                    if (req.status != 200 && req.status != 304) {
                        alert('HTTP error ' + req.status);
                        return;
                    }
                    console.log(req.responseText);
                }
                if (req.readyState == 4) return;
                req.send(postData);
            }
        }
    });
    
    return MapView;
})