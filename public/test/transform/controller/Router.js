define('test/transform/controller/Router',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    
    , 'test/transform/view/BaiduMapView'
    , 'test/transform/view/GaodeMapView'
],
function($, _, Backbone, 
    BaiduMapView, GaodeMapView){
    var r = Backbone.Router.extend({
        routes:{
            '':'home'
        },
        initialize:function(){
            this.views = {};
        },
        home:function(){
            if (!this.views.baiduMapView){
                this.views.baiduMapView = new BaiduMapView({
                    el : '#baiduMapDiv'
                });
                this.views.baiduMapView.render();
            }
            if (!this.views.gaodeMapView){
                this.views.gaodeMapView = new GaodeMapView({
                    el : '#gaodeMapDiv'
                });
                this.views.gaodeMapView.render();
            }
        }
    })
    
    return r;
})