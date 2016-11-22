//控制器：地图
define('test/mario/controller/MapController',
[
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/util/ViewIdGenerator',
    'test/mario/view/MapView'
    
],
function(_, Backbone, Radio, Marionette, Vig, MapView){
    //控制器
    var MapController = Marionette.Object.extend({
        initialize : function(options) {
            
        },
        //路由方法
        "showMainMap" : function() {
            var mapRegion = this.getOption('mapRegion');
            if (!this.mapView) {
                //实例化
                this.mapView = new MapView({
                    //element
                    el : mapRegion,
                    //
                    template : '#tpl-map-mapview'
                });
                //侦听地图初始化完成事件
                this.listenTo(this.mapView, 'map-did-init', this._mapDidInitHandler);
                //渲染节点
                var mapNode = this.mapView.render();
                //初始化地图
                this.mapView.initMap('map-' + this.mapView.getOption('mid'));
                
            }
        },
        //地图初始化完成handler
        _mapDidInitHandler : function() {
            console.log('MapController : _mapDidInitHandler');
        }
    })
    
    return MapController;
})