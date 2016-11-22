//路由：地图
define('test/mario/router/MapRouter',
[
    'underscore',
    'backbone',
    'marionette',
    'test/mario/controller/MapController'
],
function(_, Backbone, Marionette, MapController){
    //地图app router
    var MapRouter = Marionette.AppRouter.extend({
        //路由
        appRoutes : {
            //地图
            "" : "showMainMap"
        },
        initialize : function(options) {
            //控制器
            this.controller = new MapController(options);  
        }
        
        
    });
    
    return MapRouter;
})