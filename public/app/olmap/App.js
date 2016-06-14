define('app/olmap/App',
[
    'jquery',
    'underscore',
    'backbone',
    'app/olmap/controller/Router'
],
function($, _, Backbone, Router){
    function initialize(){
        console.log('init');
        
        var router = new Router({});
        Backbone.history.start();
    }
    
    return {
        initialize:initialize
    }
})