//视图：搜索
define('test/mario/view/SearchView',
[
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/util/ViewIdGenerator'
],
function(_, Backbone, Radio, Marionette, Vig){
    var SearchView = Marionette.View.extend({
        ui : {
            'searchTxt' : '.search-searchbar-searchTxt',
            'searchButton' : '.search-searchbar-searchButton'
        },
        events : {
            'click @ui.searchButton' : '_seachButtonClickHandler'
        },
        initialize : function() {
            this.mid = Vig.generate();  
        },
        templateContext : function() {
            return {
                mid : this.getOption('mid')
            }  
        },
        _seachButtonClickHandler : function() {
            var searchTxt = this.getUI('searchTxt');
            var txt = searchTxt.val();
            /*
            var searchTxt = this.ui.searchTxt;
            var txt = $(searchTxt).val();
            */
            console.log('search-searchbar-searchButton : click : ' + txt);  
        },
        onRender : function() {
            var mid = this.getOption('mid');
            this.addRegions({
                'bar' : '#search-seachbar-' + mid,
                'classify' : '#search-classify-' + mid,
                'result' : '#search-result-' + mid
            });
            
            
            
            console.log(this);
        }
    });
    
    return SearchView;
})