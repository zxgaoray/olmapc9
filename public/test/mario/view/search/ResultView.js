define('test/mario/view/search/ResultView',
[
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette'
],
function (_, Bb, BbRadio, Mn) {
    var V = Mn.View.extend({
        template : '#tpl-search-controller-search-result',
        initialize : function () {
            
        },
        onRender : function () {

        }
    });
    
    return V;
})