//page Application
define('test/mario/App',
[
    'jquery',
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/router/MapRouter',
    'test/mario/router/SearchRouter',
    'test/mario/util/Channel',
    'test/mario/util/ChannelEvent',
    'test/mario/util/AjaxUrl'
],
function($, _, Bb, BbRadio, Mn, MapRouter, SearchRouter, Channel, ChannelEvent, AjaxUrl){
    //定义module
    var App = Mn.Application.extend({
        //option
        defaultClass : 'backbone.marionette.Application',
        extraClasses : 'test.mario.App',
        //region
        regions : {
            'headerRegion' : '#header-region',
            'mapRegion' : '#map-region',
            'mainRegion' : '#main-region',
            'footerRegion' : '#footer-region',
            'dialogRegion' : '#dialog-region'
        },
        //构造
        initialize : function() {
            
        },
        //初始化
        init : function(options) {
            var self = this;
            console.log('ctx : ' + AjaxUrl.getCtx());
            //预加载模板
            $.ajax({
                url : AjaxUrl.url_main_template + '?_ds=' + new Date().getTime(),
                success : function(scripts) {
                    $('body').append(scripts);
                    //预加载模板完成
                    self.trigger('app-did-init');
                }
            });
            
        },
        //类名称
        className : function() {
            var defaultClass = this.getOption('defaultClass');
            var extraClasses = this.getOption('extraClasses');
            
            return [defaultClass, extraClasses].join(' ');  
        },
        //启动app之前
        onBeforeStart : function() {
            //this.trigger('app-will-start');
        },
        //启动App
        onStart : function(options) {
            console.log("on start");
            //路由：地图
            var mapRouter = new MapRouter({
                //地图区域
                mapRegion : options.regions.mapRegion
            });
            this.mapRouter = mapRouter;
            
            //路由：搜索
            var searchRouter = new SearchRouter();
            this.searchRouter = searchRouter;
            
            //history start
            Bb.history.start();
            
            //广播
            var channel = Channel.getChannel(Channel.GLOBAL_APP);
            channel.trigger(ChannelEvent.APP_DID_INIT, true);
        }
        
    });
    
    //返回module
    return App;
});