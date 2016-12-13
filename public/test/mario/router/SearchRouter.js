//路由：搜索
define('test/mario/router/SearchRouter',
[
    'underscore',
    'backbone',
    'marionette',
    'test/mario/controller/SearchController'
],
function(_, Backbone, Marionette, SearchController){
    //搜索app router
    var SearchRouter = Marionette.AppRouter.extend({
        //路由
        appRoutes : {
            "search" : 'showSearchBar'
        },
        initialize : function() {
            //控制器
            this.controller = new SearchController();   
        }
        
    });
    
    return SearchRouter;
});