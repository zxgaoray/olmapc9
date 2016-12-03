define('test/mario/view/search/BarView',
[
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette'
],
function (_, Bb, BBRadio, Mn) {
    var V = Mn.View.extend({
        template : '#tpl-search-controller-search-bar',
        ui : {
            'searchTxt' : '.search-searchbar-searchTxt',
            'searchButton' : '.search-searchbar-searchButton'
        },
        events : {
            'click @ui.searchButton' : '_seachButton_clickHandler'
        },
        _seachButton_clickHandler : function() {
            var searchTxt = this.getUI('searchTxt');
            var txt = searchTxt.val();
            /*
             var searchTxt = this.ui.searchTxt;
             var txt = $(searchTxt).val();
             */
            console.log('search-searchbar-searchButton : click : ' + txt);

            this.trigger('search-bar-button-did-click', {
                'searchText' : ''
            });
        }
    });

    return V;
})