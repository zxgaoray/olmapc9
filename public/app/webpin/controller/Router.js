define('app/webpin/controller/Router',
[
    'jquery',
    'underscore',
    'backbone',
    'app/webpin/view/PinView',
    'app/webpin/view/CdnView'
    , 'app/webpin/view/TestView'
],
function($, _, Backbone, PinView, CdnView, TestView){
    var r = Backbone.Router.extend({
        routes:{
            '':'home',
            'web_pins':'home',
            'cdn':'cdn'
            , 'testview' : 'testview'
        },
        initialize:function(){
            this.views = {};
            this.viewCreators = {
                'pinView':{
                    creator:PinView
                },
                'cdnView':{
                    creator:CdnView
                }
                , 'testView' : {
                    creator : TestView
                }
            }
        },
        home:function(){
            if (!this.views.pinView) {
                this._createView('pinView');
                this.views.pinView.fetchData();
            }
            this._hideAllView();
            this._activeView('pinView');
        },
        cdn:function(){
            if (!this.views.cdnView) {
                this._createView('cdnView');
                this.views.cdnView.fetchData();
            }
            
            this._hideAllView();
            this._activeView('cdnView');
        }
        , testview : function(){
            if (!this.views.testView) {
                this._createView('testView');
                this.views.testView.fetchData();
            }
            
            this._hideAllView();
            this._activeView('testView');
        }
        , _createView:function(viewName){
            if (this.views[viewName]) return;
            var clazz = this.viewCreators[viewName].creator;
            this.views[viewName] = new clazz();
        },
        _hideAllView:function(){
            var self = this;
            _.each(this.views, function(view){
                self._hideViewByInstance(view);
            })
        },
        _activeView:function(viewName) {
            if (!this.views[viewName]) return;
            
            this._showViewByKey(viewName);
        },
        _hideViewByKey:function(key){
            var view = this.views[key];
            this._hideViewByInstance(view);
        },
        _showViewByKey:function(key){
            var view = this.views[key];
            this._showViewByInstance(view);
        },
        _hideViewByInstance:function(view){
            if (typeof view['hide'] == 'function') {
                view.hide();
            }else {
                $(view.el).css('display', 'none');
            }
        },
        _showViewByInstance:function(view){
            if (typeof view['show'] == 'function') {
                view.show();
            }else {
                $(view.el).css('display', 'block');
            }
        }
        
    })
    
    return r;
})