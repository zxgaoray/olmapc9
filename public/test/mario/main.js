(!__ctx) ? __ctx = "" : 0;
(!__debug) ? __debug = true : 0

var __config = {
    paths : {
        'underscore' : __ctx + "/vendor/underscore/" + (__debug ? "underscore" : "underscore-min"),
        'backbone' : __ctx + "/vendor/backbone/" + (__debug ? "backbone" : "backbone-min"),
        'backbone.radio' : __ctx + "/vendor/backbone.radio/build/" + (__debug ? "backbone.radio" : "backbone.radio.min"),
        'marionette' : __ctx + "/vendor/backbone.marionette/lib/" + (__debug ? "backbone.marionette" : "backbone.marionette.min"),
        'jquery' : __ctx + '/vendor/jquery-dist/jquery.min',
        'ol3' : __ctx + '/vendor/ol3/' + (__debug ? "ol-debug" : "ol"),
        'test' : __ctx + '/test'
    }
}

require.config(__config);

require(
[
    'underscore',
    'backbone',
    'marionette',
    'test/mario/App'
],
function(_, Backbone, Marionette, App){
    var app = new App();
    
    app.start();
})