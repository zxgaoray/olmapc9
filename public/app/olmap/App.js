define('app/olmap/App',
[
    'jquery',
    'underscore',
    'backbone'
],
function($, _, Backbone){
    function initialize(){
        console.log('init');
    }
    
    return {
        initialize:initialize
    }
})