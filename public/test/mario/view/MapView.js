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

            var overlay = new ol.Overlay({
                element : document.getElementById('popup'),
                autoPan : true,
                autoPanAnimation : {
                    duration : 250
                }
            });





            this.overlay = overlay;

            var map = new ol.Map({
                //目标div
                target : mapdiv,
                renderer : 'canvas',
                //覆盖物
                overlays : [overlay],
                //控制件
                controls : [],
                //图层
                layers: [
                    baseLayer
                ],
                //视图
                view : new ol.View({
                    center : ol.proj.fromLonLat([120.21844, 30.2096]),
                    zoom : 5
                })
            });

            this.map = map;

            var closer = document.getElementById('popup-closer');

            closer.onclick = function() {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            };

            this._initBaseControl();

            //this.map.addLayer(this._generateLayer('tdt-anno'));

            this.trigger('map-did-init');

            //加载wms服务
            this._addWmsLayer();

            //按照过滤器加载wfs
            this._addWfsLayer();

            //按照范围加载wfs
            //this._addWfsLayer2();

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
                    /*
                    fill : new ol.style.Fill({
                        color : 'rgba(255,0,0,0.3)'
                    })
                    */
                })
            });

            this.map.addLayer(vector);
            var map = this.map;

            var featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:3857',
                featureNS: 'http://www.openplans.org/walrus',
                featurePrefix: 'walrus',
                featureTypes: ['admreg_province'],
                outputFormat: 'application/json',
                filter: ol.format.ogc.filter.or(
                    ol.format.ogc.filter.like('province', '浙江*'),
                    ol.format.ogc.filter.equalTo('province', '江苏省')
                )

            });

            var self = this;

            var xml = new XMLSerializer().serializeToString(featureRequest);

            /*
            fetch('http://127.0.0.1:8080/geoserver/wfs', {
                method: 'POST',
                body: xml
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                loadFeatures(json);
            });
            */

            $.ajax({
                url : 'http://127.0.0.1:8080/geoserver/wfs',
                type : 'post',
                contentType: 'application/json',
                data : xml,
                success: function (json) {
                    loadFeatures(json);
                }
            });

            function loadFeatures(json) {
                var features = new ol.format.GeoJSON().readFeatures(json);
                vectorSource.addFeatures(features);

                var selectSingleClick = new ol.interaction.Select();
                self.map.addInteraction(selectSingleClick);
                selectSingleClick.on('select', function (e) {
                    var extent = e.selected[0].getGeometry().getExtent();
                    var coord = [(extent[0] + extent[2])/2, (extent[1] + extent[3])/2];
                    self.overlay.setPosition(coord);

                    var data = {
                        province : e.selected[0].getProperties()['province'],
                        aliasname : e.selected[0].getProperties()['aliasname'],
                        admincode : e.selected[0].getProperties()['admincode']
                    };

                    var template = _.template(templateString());

                    $('#popup-content').html(template(data));

                    console.log(e.selected[0].getProperties()['admincode']);

                });
            }


            function templateString() {
                return '<div>' +
                            '<div>行政区 ：<%=province%></div>' +
                            '<div>简称 ： <%=aliasname%></div>' +
                            '<div>编码 ： <%=admincode%></div>' +
                        '</div>'
            }

            /*
            var xml = ''
            
            $.ajax({
                url : '',
                type : 'post',
                data : xml,
                success : function (e) {
                    console.log(e);
                }
            })
            */


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
        },
        _addWfsLayer2 : function () {
            var vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function(extent) {
                    return 'http://127.0.0.1:8080/geoserver/wfs?service=WFS&' +
                        'version=1.1.0&request=GetFeature&typename=walrus:admreg_province&' +
                        'outputFormat=application/json&srsname=EPSG:3857&' +
                        'bbox=' + extent.join(',') + ',EPSG:3857';
                },
                strategy: ol.loadingstrategy.bbox
            });


            var vector = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 255, 1.0)',
                        width: 2
                    }),
                    fill : new ol.style.Fill({
                        color : 'rgba(255,0,0,0.5)'
                    })
                })
            });

            this.map.addLayer(vector);

            var selectSingleClick = new ol.interaction.Select();

            // select interaction working on "click"

            this.map.addInteraction(selectSingleClick);

            this.map.on('singleclick', function (e) {
                console.log(e.coordinate);
            })

            var self = this;
            selectSingleClick.on('select', function (e) {
                console.log(e);
                console.log(e.selected[0].getGeometry().getFirstCoordinate());
                //self.overlay.setPosition(ol.proj.fromLonLat([120.2,30.2]), 'EPSG:3857');
                self.overlay.setPosition(e.selected[0].getGeometry().getFirstCoordinate());

                $('#popup-content').html('<div>行政区编号 : '+ e.selected[0].getProperties()['admincode'] + '</div>');

                console.log(e.selected[0].getProperties()['admincode']);

            })
        }
    });
    
    return MapView;
})