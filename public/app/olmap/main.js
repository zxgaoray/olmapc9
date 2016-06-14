require.config({
    paths:{
        'jquery':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min',
        'bootstrap':'https://cdn.bootcss.com/bootstrap/2.3.2/js/bootstrap.min',
        'underscore':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min',
        'backbone':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min',
        'app':'/app'
    },
    shim:{
        'bootstrap':['jquery']
    }
})

require(
[
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'app/olmap/App'
],
function($, _, Backbone, Bootstrap, App){
    App.initialize();
})