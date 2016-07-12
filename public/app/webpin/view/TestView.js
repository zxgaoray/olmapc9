define('app/webpin/view/TestView',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!app/webpin/template/TestView.ejs'
],
function($, _, Backbone, tmpl){
    var TestView = Backbone.View.extend({
        el : '#test-view'
        , initialize:function(){
            this.template = _.template(tmpl);
        }
        , render: function() {
            $(this.el).html(this.template({}))
        }
        , fetchData : function(){
            this.render();
        }
    });
    
    return TestView;
})