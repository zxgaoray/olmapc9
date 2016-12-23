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
function($, _, Backbone, Radio, Mn, Vig, ol, TileParams, turf, Highcharts){
    var MapView = Mn.View.extend({
        initialize : function() {
            this.mid = Vig.generate();
        },
        templateContext : function() {
            return {
                mid : this.getOption('mid')
            }  
        },
        //region 创建地图
        initMap : function(mapdiv) {
            //底图图层
            var baseLayer = this._initBaseLayer('gaode-vec');
            //气泡
            var overlay = new ol.Overlay({
                element : document.getElementById('popup'),
                autoPan : true,
                autoPanAnimation : {
                    duration : 250
                }
            });
            this.overlay = overlay;
            //地图对象
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

            //气泡关闭
            var closer = document.getElementById('popup-closer');

            closer.onclick = function() {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            };

            //控件
            this._initBaseControl();

            //this.map.addLayer(this._generateLayer('tdt-anno'));

            this.trigger('map-did-init');

            //region 服务
            //加载wms服务
            this._addWmsLayer();

            //wfs 行政区多边形
            this._addWfsLayer();

            //wfs 行政区点
            this._addWfsLayer2();
            //endregion

            //region 要素
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

            //动画
            this._animation();

            //spline
            this._spline();

            //endregion

        },
        //endregion
        //region 私有
        //初始化底图
        _initBaseLayer : function (type) {
            return this._generateLayer(type);
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
            var coord = ol.proj.fromLonLat([126.89, 37.55], "EPSG:3857");
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
                    url: 'http://localhost:8080/geoserver/walrus/wms',
                    params: {'LAYERS': 'walrus:province_region_4326'},
                    serverType: 'geoserver'
                })
            });

            this.map.addLayer(wms);
            //endregion
        },
        //省级行政区 矢量
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
                url : 'http://localhost:8080/geoserver/wfs',
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
        //省会 矢量
        _addWfsLayer2 : function () {
            var vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function(extent) {
                    return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
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

            this._provinceCenterLayer = vector;
        },
        //highcharts as overlay
        _addCharts : function () {
            var pie = new ol.Overlay({
                position: ol.proj.fromLonLat([141, 20], "EPSG:3857"),
                positioning: ol.OverlayPositioning.CENTER_CENTER,
                element: document.getElementById('canvasDiv')
            });
            this.map.addOverlay(pie);
            $(function () {
                $(document).ready(function () {
                    Highcharts.chart('canvasDiv', {
                        credits : {
                            text : ''
                        },
                        chart: {
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                            plotBorderColor: null,
                            plotBackgroundColor: null,
                            plotBackgroundImage: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            width: 160,
                            height: 160,
                            margin : 0,
                            borderRadius : 80
                        },

                        /*
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        */
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        /*
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer'
                            },
                        },
                        */
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: false
                            }
                        },

                        title: null,

                        dataLabels: {
                            enabled: false,
                            color: '#000000',
                            //distance: -20,
                            connectorColor: '#000000',
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                            }

                        },

                        series: [{
                            type: 'pie',
                            name: 'Browser share',
                            data: [{
                                name: 'MSIE',
                                y: 56.33
                            }, {
                                name: 'Chrome',
                                y: 24.03,
                                sliced: true,
                                selected: true
                            }, {
                                name: 'Firefox',
                                y: 10.38
                            }, {
                                name: 'Safari',
                                y: 4.77
                            }, {
                                name: 'Opera',
                                y: 0.91
                            }, {
                                name: 'other',
                                y: 0.2
                            }]
                        }]
                    });
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

            var coord = ol.proj.fromLonLat([128, 20], "EPSG:3857");
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
                position : ol.proj.fromLonLat([144, 30], 'EPSG:3857'),
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
                    "coordinates": [[160, 34],[163,30], [158, 26]]
                }
            };
            var unit = 'meters';

            var buffered = turf.buffer(pt, 50000, unit);

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
        },
        //animation
        _animation : function () {
            var self = this;
            var style = new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 10,
                    fill : new ol.style.Fill({
                        color : 'rgba(0, 255, 0, 0.6)'
                    }),
                    stroke : new ol.style.Stroke({
                        color : 'white'
                    })

                })
            });

            var coord = ol.proj.fromLonLat([137, 35]);
            var x = coord[0], y=coord[1];
            var r = 500000;
            var theta = 0;

            this.map.on('postcompose', function (event) {
                var vectorContext = event.vectorContext;
                var frameState = event.frameState;

                theta = 2 * Math.PI * frameState.time/10000;

                var x1 = x + r * Math.cos(theta);
                var y1 = y + r * Math.sin(theta);

                var coord1 = [x1, y1];

                vectorContext.setStyle(style);
                vectorContext.drawGeometry(new ol.geom.Point(coord1));

                self.map.render();

            });
            //this.map.render();
        },
        _spline : function () {
            var self = this;
            //region 生成曲线
            $('#spline').click(function () {
                if (self._curveLayer) return;
                var source = self._provinceCenterLayer.getSource();
                var features = source.getFeatures();

                var f = features[0];
                var x = f.getGeometry().getCoordinates()[0][0];
                var y = f.getGeometry().getCoordinates()[0][1];

                //region 循环
                var curveSource = new ol.source.Vector();
                for (var i=1; i < features.length; i++) {
                    var f1 = features[i];

                    var x1 = f1.getGeometry().getCoordinates()[0][0];
                    var y1 = f1.getGeometry().getCoordinates()[0][1];

                    var xM = x + (x1 - x) / 1.8;
                    var yM = y + (y1 - y) / 1.8;

                    //var distance = turf.distance(from, to, 'miles');
                    var distance = Math.sqrt(Math.pow(x1-x, 2) + Math.pow(y1-y, 2));

                    xM = xM + distance * 0.14;

                    var line = {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [x,y],
                                [xM, yM],
                                [x1, y1]
                            ]
                        }
                    };

                    var curve = turf.bezier(line);

                    curveSource.addFeatures((new ol.format.GeoJSON()).readFeatures(curve))
                }
                var layer = new ol.layer.Vector({
                    source : curveSource,
                    style : [
                        new ol.style.Style({
                            stroke : new ol.style.Stroke({
                                color : 'white',
                                width : 3
                            })
                        }),
                        new ol.style.Style({
                            stroke : new ol.style.Stroke({
                                color : 'rgba(31,144,256,1)',
                                width : 2
                            })
                        })
                    ]

                });

                self._curveLayer = layer;
                
                //endregion

                /*
                //region 单个
                var f1 = features[1];

                var x = f.getGeometry().getCoordinates()[0][0];
                var y = f.getGeometry().getCoordinates()[0][1];

                var x1 = f1.getGeometry().getCoordinates()[0][0];
                var y1 = f1.getGeometry().getCoordinates()[0][1];

                var xM = (x1 + x) / 2;
                var yM = (y1 + y) / 2;

                //var distance = turf.distance(from, to, 'miles');
                var distance = Math.sqrt(Math.pow(x1-x, 2) + Math.pow(y1-y, 2));

                console.log(distance);

                xM = xM + distance * 0.1;

                var line = {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [x,y],
                            [xM, yM],
                            [x1, y1]
                        ]
                    }
                };

                console.log(line);

                var curve = turf.bezier(line);



                var layer = new ol.layer.Vector({
                    source : new ol.source.Vector({
                        features: (new ol.format.GeoJSON()).readFeatures(curve)
                    }),
                    style : new ol.style.Style({
                        stroke : new ol.style.Stroke({
                            color : 'red',
                            width : 2
                        })
                    })
                });
                //endregion
                */

                self.map.addLayer(layer);

            });
            //endregion

            //region 同步动画
            var sync = false;
            var syncAnim = null;
            $('#sync').click(function () {
                if (!self._curveLayer) return;
                var now = new Date().getTime();

                var curveSource = self._curveLayer.getSource();

                if (!curveSource) return;

                if (sync === true) {
                    if (syncAnim){
                        self.map.unByKey(syncAnim);
                    }

                    sync = false;
                    return;
                }

                syncAnim = self.map.on('postcompose', function (event) {
                    var vectorContext = event.vectorContext;
                    var frameState = event.frameState;


                    var features = curveSource.getFeatures();

                    var style = new ol.style.Style({
                        image : new ol.style.Circle({
                            radius : 4,
                            fill : new ol.style.Fill({
                                color : 'rgba(31,144,256,1)'
                            })

                        })
                    });

                    vectorContext.setStyle(style);


                    var n = parseInt((frameState.time - now)/10);

                    for (var i = 0; i < features.length; i ++) {
                        var feature = features[i];
                        var fc = feature.getGeometry().getCoordinates();
                        var coord = fc[n % (fc.length)];


                        vectorContext.drawGeometry(new ol.geom.Point(coord));

                    }
                    self.map.render();

                });
                sync = !sync;
            });
            //endregion

            //region 异步动画
            var aSync = false;

            var asyncAnim = null;

            $('#async').click(function () {
                if (!self._curveLayer) return;

                var curveSource = self._curveLayer.getSource();

                if (!curveSource) return;

                if (aSync === true) {
                    self.map.unByKey(asyncAnim);
                    aSync = false;
                    return;
                }

                var n = 0;
                var features = curveSource.getFeatures();

                asyncAnim = self.map.on('postcompose', function (event) {
                    var vectorContext = event.vectorContext;
                    var frameState = event.frameState;

                    var style = new ol.style.Style({
                        image : new ol.style.Circle({
                            radius : 4,
                            fill : new ol.style.Fill({
                                color : 'rgba(31,144,256,1)'
                            })

                        })
                    });

                    vectorContext.setStyle(style);

                    var go = 20 * n;

                    for (var i = 0; i < features.length; i ++) {
                        var feature = features[i];
                        var fc = feature.getGeometry().getCoordinates();

                        var geojson = (new ol.format.GeoJSON()).writeFeatureObject(feature, {featureProjection: 'EPSG:3857'});
                        var dis = turf.lineDistance(geojson, 'kilometers');

                        var index = parseInt(go * fc.length / dis);
                        var coord = fc[index%fc.length];
                        vectorContext.drawGeometry(new ol.geom.Point(coord));

                        /*
                        var adis = go % dis;
                        var p = turf.along(geojson, adis, 'kilometers');
                        vectorContext.drawGeometry(new ol.geom.Point(p.geometry.coordinates));
                        */



                    }
                    self.map.render();
                    n++;
                });

                aSync = !aSync;
            });

            //endregion
        }
        //endregion
    });
    
    return MapView;
});