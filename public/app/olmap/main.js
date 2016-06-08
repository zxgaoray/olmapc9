require.config({
    paths:{
        'jquery':'http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js',
        'bootstrap':'http://cdn.bootcss.com/bootstrap/2.3.2/js/bootstrap.min.js',
        'underscore':'http://cdn.bootcss.com/underscore.js/1.8.3/underscore-min.js',
        'backbone':'http://cdn.bootcss.com/backbone.js/1.3.3/backbone-min.js',
        'app':'/app'
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