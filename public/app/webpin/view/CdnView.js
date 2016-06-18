define('app/webpin/view/CdnView',
[
    'jquery',
    'underscore',
    'backbone',
    'text!app/webpin/template/CdnView.ejs',
    
    'app/webpin/collection/CdnCollection'
],
function($, _, Backbone, tmpl, CdnCollection){
    var v = Backbone.View.extend({
        el:'#cdn-view',
        initialize:function(){
            this.collection = new CdnCollection();
            this.collection.on('reset', this._fetchedData, this);
            
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
        _fetchedData:function(){
            this.render();
        }
    })
    
    return v;
})