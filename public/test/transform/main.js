require.config({
    paths:{
        'jquery':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
        , 'bootstrap':'https://cdn.bootcss.com/bootstrap/2.3.2/js/bootstrap.min'
        , 'underscore':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
        , 'backbone':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
        , 'OpenLayers' : 'https://cdn.bootcss.com/openlayers/2.13.1/OpenLayers'
        , 'text' : 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min'
        , 'domReady' : 'https://cdn.bootcss.com/require-domReady/2.0.1/domReady.min'
        , 'olext' : 'olext'
        , 'test':'/test'
    },
    shim:{
        'bootstrap':['jquery']
        , 'OpenLayers' : {
            exports : 'OpenLayers'
        }
    }
})

require(
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'bootstrap'
    , 'test/transform/App'
    , 'domReady!'
],
function($, _, Backbone, Bootstrap, App){
    App.initialize();
})