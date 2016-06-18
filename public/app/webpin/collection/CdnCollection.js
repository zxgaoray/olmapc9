define('app/webpin/collection/CdnCollection',
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
                url:'/cdnlist',
                success:function(json){
                    self.reset(json);
                }
            })
        }
    })
    
    return PinCollection;
})