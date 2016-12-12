//页面的main

//全局变量
(!__ctx) ? __ctx = "" : "";
//__debug = false;
(!__debug) ? __debug = false : true;

var __dependences = {
    'underscore' : {
        ctx : __ctx,
        path : '/vendor/underscore/',
        minimize : 'underscore-min',
        debug : 'underscore'
    },
    'backbone' : {
        ctx : __ctx,
        path : '/vendor/backbone/',
        minimize : 'backbone-min',
        debug : 'backbone'
    },
    'backbone.radio' : {
        ctx : __ctx,
        path : '/vendor/backbone.radio/build/',
        minimize : 'backbone.radio.min',
        debug : 'backbone.radio'
    },
    'marionette' : {
        ctx : __ctx,
        path : '/vendor/backbone.marionette/lib/',
        minimize : 'backbone.marionette.min',
        debug : 'backbone.marionette'
    },
    'jquery' : {
        ctx : __ctx,
        path : '/vendor/jquery-dist/jquery.min',
        minimize : '',
        debug : ''
    },
    'ol3' : {
        ctx : __ctx,
        path : '/vendor/ol3/',
        minimize : 'ol',
        debug : 'ol-debug'
    },
    'highcharts' : {
        ctx : __ctx,
        path : '/vendor/highcharts/',
        minimize : 'highcharts',
        debug : 'highcharts'
    },
    'chartjs' : {
        ctx : __ctx,
        path : '/vendor/chart.js/dist/',
        minimize : 'Chart.bundle',
        debug : 'Chart'
    },
    'turfjs' : {
        ctx : __ctx,
        path : '/vendor/turfjs/',
        minimize : 'turf.min',
        debug : 'turf.min'
    }
}

var __paths = {};

if (__debug) {
    for (var k in __dependences) {
    var v = __dependences[k];
    
     __paths[k] = v.ctx + v.path + v.debug;
    
    }
}else {
    for (var k in __dependences) {
    var v = __dependences[k];
    
     __paths[k] = v.ctx + v.path + v.minimize;
    
    }
}

__paths['test'] = __ctx + '/test';

console.log(__paths);

//依赖配置
var __config = {
    paths : __paths,
    shim : {
        
    }
}

require.config(__config);

//入口
require(
[
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'test/mario/App'
],
function($, _, Backbone, Marionette, App){
    var options = {
        regions : {
            'headerRegion' : '#header-region',
            'mapRegion' : '#map-region',
            'mainRegion' : '#main-region',
            'footerRegion' : '#footer-region',
            'dialogRegion' : '#dialog-region'
        }
    }
    //实例化
    var app = new App();
    
    //侦听初始化事件
    app.on('app-did-init', function(){
        app.start(options);
    });
    
    //初始化
    app.init();
    
})


