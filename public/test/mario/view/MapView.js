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
    'test/mario/gis/TileParams',
    'turfjs',
    'highcharts',
    'chartjs'

],
function($, _, Backbone, Radio, Mn, Vig, ol, TileParams, turf){
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
                    projection : 'EPSG:3857',
                    center : ol.proj.fromLonLat([120.21844, 30.2096], 'EPSG:3857'),
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
            this._addWfsLayer2();



            //加载矢量要素
            this._addVectorLayer();

            //加载图标
            this._addCharts();

            //使用渲染器
            this._renderGeometry();

            //使用chart.js
            this._addChartJS();

            //tin
            this._turfTin();

            //缓冲区
            this._turfBuffer();

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
        //创建layer
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
                            url : url,
                            projection : 'EPSG:3857'
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
        //创建矢量layer
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

            var vectorLayer = new ol.layer.Vector({
                source : new ol.source.Vector(),
                style: function(feature) {
                    return feature.get('style');
                }
            });
            this.map.addLayer(vectorLayer);

            vectorLayer.getSource().addFeature(feature);
        },
        //添加wms层
        _addWmsLayer : function () {
            //region 3857
            /*
            var wms = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: 'http://localhost:8080/geoserver/walrus/wms',
                    params: {'LAYERS': 'walrus:admreg_province'},
                    serverType: 'geoserver'
                })
            });

            this.map.addLayer(wms);
            */
            //endregion

            //region 4326
            var wms = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: 'http://10.21.131.19:8080/geoserver/walrus/wms',
                    params: {'LAYERS': 'walrus:province_region_4326'},
                    serverType: 'geoserver'
                })
            });

            this.map.addLayer(wms);
            //endregion
        },
        //添加wfs层
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
                url : 'http://10.21.131.19:8080/geoserver/wfs',
                type : 'post',
                contentType: 'application/json',
                data : xml,
                success: function (json) {
                    loadFeatures(json);
                }
            });

            //加载
            function loadFeatures(json) {
                var features = new ol.format.GeoJSON().readFeatures(json);
                vectorSource.addFeatures(features);

                var selectSingleClick = new ol.interaction.Select();
                self.map.addInteraction(selectSingleClick);
                selectSingleClick.on('select', function (e) {
                    var feature = e.selected[0];
                    var type = feature.getGeometry().getType();

                    var extent = e.selected[0].getGeometry().getExtent();
                    var coord = [(extent[0] + extent[2])/2, (extent[1] + extent[3])/2];
                    self.overlay.setPosition(coord);

                    var template = null;
                    var data = null;
                    switch (type) {
                        case 'MultiPolygon' :
                            data = {
                                province : feature.getProperties()['province'],
                                aliasname : feature.getProperties()['aliasname'],
                                admincode : feature.getProperties()['admincode']
                            };

                            template = _.template(templateString());
                            break;
                        case 'MultiPoint':
                            data = {
                                name : feature.getProperties()['name']
                            };
                            template = _.template(templateCityString());
                            break;
                        default :
                            template = _.template('<div></div>');
                            break;
                    }

                    $('#popup-content').html(template(data));

                });
            }

            //行政区模板
            function templateString() {
                return '<div>' +
                            '<div>行政区 ：<%=province%></div>' +
                            '<div>简称 ： <%=aliasname%></div>' +
                            '<div>编码 ： <%=admincode%></div>' +
                        '</div>'
            }

            //省会模板
            function templateCityString() {
                return '<div>城市 ：<%=name%></div>'
            }
        },
        //省会
        _addWfsLayer2 : function () {
            var vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function(extent) {
                    return 'http://10.21.131.19:8080/geoserver/wfs?service=WFS&' +
                        'version=1.1.0&request=GetFeature&typename=walrus:province_center&' +
                        'outputFormat=application/json&srsname=EPSG:3857&' +
                        'bbox=' + extent.join(',') + ',EPSG:3857';
                },
                strategy: ol.loadingstrategy.bbox
            });

            var image = new ol.style.Circle({
                radius : 10,
                stroke : new ol.style.Stroke({color: 'yellow', width: 3}),
                fill : new ol.style.Fill({
                    color : 'orange'
                })
            });

            var vector = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    image : image
                })
            });

            this.map.addLayer(vector);
        },
        //highcharts as overlay
        _addCharts : function () {
            var pie = new ol.Overlay({
                position: ol.proj.fromLonLat([126.21844, 30.2096], "EPSG:3857"),
                positioning: ol.OverlayPositioning.CENTER_CENTER,
                element: document.getElementById('canvasDiv')
            });
            this.map.addOverlay(pie);
            $(function () {
                $('#canvasDiv').highcharts({
                    chart: {
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                        plotBorderColor: null,
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        width: 200,
                        height: 200
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer'
                        }
                    },
                    title: {
                        text: ''
                    },
                    dataLabels: {
                        enabled: false,
                        color: '#000000',
                        //distance: -20,
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                        }

                    },
                    series: [{
                        type: 'pie',
                        name: 'Browser share',
                        data: [
                            ['Firefox', 45.0],
                            ['IE', 26.8],
                            {
                                name: 'Chrome',
                                y: 12.8,
                                sliced: true,
                                selected: true
                            },
                            ['Safari', 8.5],
                            ['Opera', 6.2],
                            ['Others', 0.7]
                        ]
                    }]
                });
            });
        },
        //canvas image charts
        _renderGeometry : function () {
            var canvas = document.createElement('canvas');
            var vectorContext = ol.render.toContext(canvas.getContext('2d'),
                {
                    size : [100, 100]
                }
            );



            var style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color : 'rgba(0,0,255,0.7)'
                }),
                stroke: new ol.style.Stroke({
                    color : 'white'
                })
            });
            vectorContext.setStyle(style);

            ol.geom.Sector = function (center, randius, sAngle, eAngle) {
                sAngle = sAngle % 360;
                eAngle = eAngle % 360;
                var m = eAngle - sAngle;
                var points = [];
                points.push(center);
                var ep = null;
                for (var i = 0; i <= m; ++i) {
                    var x = center[0] + randius * Math.cos(degreeToRadian(sAngle + i));
                    var y = center[1] + randius * Math.sin(degreeToRadian(sAngle + i));
                    points.push([x, y]);
                }
                points.push(center);
                return new ol.geom.Polygon([points]);
            };

            var degreeToRadian = function (degree) {
                return Math.PI * degree / 180;
            };

            var sec = new ol.geom.Sector([40, 40], 30, 0, 120);
            vectorContext.drawGeometry(sec);

            var style2 = new ol.style.Style({
                fill : new ol.style.Fill({
                    color : 'rgba(255,0,0, 0.7)'
                }),
                stroke : new ol.style.Stroke({
                    color : 'white'
                })
            });

            vectorContext.setStyle(style2);
            var sec2 = new ol.geom.Sector([40,40], 30, 120, 210);
            vectorContext.drawGeometry(sec2);

            var style3 = new ol.style.Style({
                fill : new ol.style.Fill({
                    color : 'rgba(0,255,0,0.7)'
                }),
                stroke : new ol.style.Stroke({
                    color : 'white'
                })
            });
            vectorContext.setStyle(style3);
            var sec3 = new ol.geom.Sector([40, 40], 30, 210, 359.9);
            vectorContext.drawGeometry(sec3);

            var coord = ol.proj.fromLonLat([120.21844, 31.2096], "EPSG:3857");
            var feature = new ol.Feature(new ol.geom.Point(coord));

            var style = new ol.style.Style({
                image : new ol.style.Icon({
                    img : canvas,
                    imgSize : [100, 100],
                    rotation : 0
                })
            });

            var vectorLayer = new ol.layer.Vector({
                source : new ol.source.Vector(),
                style: style
            });
            this.map.addLayer(vectorLayer);

            vectorLayer.getSource().addFeature(feature);
        },
        //使用chart.js
        _addChartJS : function () {
            var canvas = $('body').append('<div id="canvasDiv2" style="width: 400px;height: 300px;"><canvas id="myChart"></canvas></div>')
            //获取canvas context
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });

            var bar = new ol.Overlay({
                position : ol.proj.fromLonLat([122, 18], 'EPSG:3857'),
                positioning : ol.OverlayPositioning.CENTER_CENTER,
                element : document.getElementById('canvasDiv2')
            });

            this.map.addOverlay(bar);
        },
        //TIN
        _turfTin : function () {
            /*
            var extent = this.map.getView().calculateExtent(this.map.getSize());
            var points = turf.random('points', 30, {
                bbox: extent
            });
            */
            var points = turf.random('points', 30, {
                bbox: [50, 30, 70, 50]
            });
            for (var i = 0; i < points.features.length; i++) {
                points.features[i].properties.z = ~~(Math.random() * 9);
            }
            var tin = turf.tin(points, 'z');
            for (var i = 0; i < tin.features.length; i++) {
                var properties  = tin.features[i].properties;
                properties.fill = '#' + properties.a +
                    properties.b + properties.c;
            }

            var source1 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(points, {featureProjection : 'EPSG:3857'})
            });

            var source2 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(tin, {featureProjection : 'EPSG:3857'})
            });

            var vl1 = new ol.layer.Vector({
                source : source1,
                style : new ol.style.Style({
                    image : new ol.style.Circle({
                        radius : 6,
                        fill : new ol.style.Fill({
                            color : 'black'
                        }),
                        stroke : new ol.style.Stroke({
                            color : 'red'
                        })
                    })
                })
            });

            var vl2 = new ol.layer.Vector({
                source : source2,
                style : new ol.style.Style({
                    fill : new ol.style.Fill({
                        color : 'rgba(255,255,0,0.5)'
                    }),
                    stroke : new ol.style.Stroke({
                        color : 'orange'
                    })
                })
            });

            this.map.addLayer(vl2);

            this.map.addLayer(vl1);
        },
        //缓冲区
        _turfBuffer : function () {
            var pt = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[160, 34],[163,30]]
                }
            };
            var unit = 'miles';

            var buffered = turf.buffer(pt, 500, unit);

            var source1 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(pt, {featureProjection : 'EPSG:3857'})
            });

            var source2 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(buffered, {featureProjection : 'EPSG:3857'})
            });

            var vl1 = new ol.layer.Vector({
                source : source1,
                style : new ol.style.Style({
                    stroke : new ol.style.Stroke({
                        color : 'blue'
                    })
                })
            });

            var vl2 = new ol.layer.Vector({
                source : source2,
                style : new ol.style.Style({
                    fill : new ol.style.Fill({
                        color : 'rgba(255,255,0,0.5)'
                    }),
                    stroke : new ol.style.Stroke({
                        color : 'orange'
                    })
                })
            });

            this.map.addLayer(vl2);

            this.map.addLayer(vl1);
        }

    });
    
    return MapView;
})