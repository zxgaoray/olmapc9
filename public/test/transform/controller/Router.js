define('test/transform/controller/Router',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'test/transform/view/BaiduMapView'
    , 'test/transform/view/GaodeMapView'
],
function($, _, Backbone, BaiduMapView, GaodeMapView){
    var r = Backbone.Router.extend({
        routes:{
            '':'home'
        },
        initialize:function(){
            this.views = {};
        },
        home:function(){
            
        }
    })
    
    return r;
})