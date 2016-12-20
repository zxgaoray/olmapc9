//页面的main

//region   全局变量
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

//依赖配置
var __config = {
    paths : __paths,
    shim : {
        'highcharts' : {
            exports : 'Highcharts'
        }
    }
}
//endregion

require.config(__config);

/*
//region require AMD

require.config({
    paths : {
        'jquery' : __ctx + '/vendor/jquery-dist/jquery.min',
        'underscore' : __ctx + '/vendor/underscore/underscore-min',
        'backbone' : __ctx + '/vendor/backbone/backbone-min',
        'backbone.radio' : __ctx + '/vendor/backbone.radio/build/backbone.radio.min',
        'marionette' : __ctx + '/vendor/backbone.marionette/lib/backbone.marionette.min',
        'ol3' : __ctx + '/vendor/ol3/ol',
        'highcharts' : __ctx + '/vendor/highcharts/highcharts',
        'chartjs' : __ctx + '/vendor/chart.js/dist/Chart.bundle',
        'turfjs' : __ctx + '/vendor/turfjs/turf.min',

        'test' : '/test'

    },
    shim : {
        'highcharts' : {
            exports : 'Highcharts'
        }
    }
});

//endregion
*/

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
    };

    //实例化
    var app = new App();
    
    //侦听初始化事件
    app.on('app-did-init', function(){
        app.start(options);
    });
    
    //初始化
    app.init();
    
});


