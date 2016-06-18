define('app/webpin/App',
[
    'jquery',
    'underscore',
    'backbone',
    
    'app/webpin/controller/Router'
],
function($, _, Backbone, Router){
    function initialize() {
        var r = new Router();
        Backbone.history.start();
    }
    
    return {
        initialize : initialize
    }
})