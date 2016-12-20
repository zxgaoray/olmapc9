//控制器：搜索
define('test/mario/controller/SearchController',
[
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/util/Channel',
    'test/mario/util/ChannelEvent',
    'test/mario/view/SearchView'
],
function(_, Backbone, Radio, Marionette, Channel, ChannelEvent, SearchView){
    
    //定义module
    var SearchController = Marionette.Object.extend({
        //构造
        initialize : function(options) {
            //app频道
            this.appChannel = Channel.getChannel(Channel.GLOBAL_APP);
            //侦听app已经init的事件
            this.listenTo(this.appChannel, ChannelEvent.APP_DID_INIT, this._appDidInitHandler);
        },
        //路由调用的方法
        'showSearchBar' : function() {
            console.log('show Search Bar');
        },
        //app已经init的事件handler
        _appDidInitHandler : function() {
            console.log('SearchController : _appDidInitHandler');
            if (!this.searchView) {
                this.searchView = new SearchView({
                    el : '#search',
                    template : '#tpl-search-controller-search-view'
                });
                this.searchView.render();
            }
        }
    });
    
    //返回module
    return SearchController;
});