define('app/webpin/view/PinView',
[
    'jquery',
    'underscore',
    'backbone',
    'text!/app/webpin/template/PinView.ejs',
    
    'app/webpin/collection/PinCollection'
],
function($, _, Backbone, tmpl, PinCollection){
    var PinView = Backbone.View.extend({
        el:'#pin-view',
        initialize:function(){
            this.collection = new PinCollection();
            this.collection.on('reset', this._listReset, this);
            this.template = _.template(tmpl);
        },
        render:function(){
            $(this.el).html(this.template({
                list:this.collection.toJSON()
            }))  
        },
        fetchData:function(){
            this.collection.fetchData();
        },
        _listReset:function(){
            this.render();
        }
    })
    
    return PinView;
})