define('app/olmap/controller/Router',
[
    'jquery',
    'underscore',
    'backbone',
    'app/olmap/view/MapView'
],
function($, _, Backbone){
    var r = Backbone.Router.extend({
        routes:{
            '':'home'
        },
        initialize:function(){
            
        },
        home:function(){
            
        }
    })
    
    return r;
})