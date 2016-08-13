define('test/transform/App',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'test/transform/controller/Router'
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