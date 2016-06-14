define('app/webpin/collection/PinCollection',
[
    'jquery',
    'underscore',
    'backbone'
],
function($, _, Backbone){
    var PinCollection = Backbone.Collection.extend({
        initialize:function(){
            
        },
        fetchData:function(){
            var self = this;
            $.ajax({
                url:'/webpins',
                success:function(json){
                    self.reset(json.list);
                }
            })
        }
    })
    
    return PinCollection;
})