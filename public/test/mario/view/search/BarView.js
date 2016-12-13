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
            'searchButton' : '.search-searchbar-searchButton',
            'toggleButton' : '.search-searchbar-toggleButton',
            'reopenButton' : '.search-searchbar-reopenButton'
        },
        events : {
            'input @ui.searchTxt' : '_searchTxt_inputHandler',
            'click @ui.searchButton' : '_searchButton_clickHandler',
            'click @ui.toggleButton' : '_toggleButton_clickHandler',
            'click @ui.reopenButton' : '_reopenButton_clickHandler'

        },
        showToggleButton : function () {
            var ui = this.getUI('toggleButton');
            ui.show();
        },
        showReopenButton : function () {
            var ui = this.getUI('reopenButton');
            ui.show();
        },
        _searchTxt_inputHandler : function () {
            var len = this.getUI('searchTxt').val().length;
            if (len === 0) {
                this.getUI('reopenButton').hide();
            }
        },
        _searchButton_clickHandler : function() {
            var ui = this.getUI('searchTxt');
            var txt = ui.val();
            /*
             var searchTxt = this.ui.searchTxt;
             var txt = $(searchTxt).val();
             */
            console.log('search-searchbar-searchButton : click : ' + txt);

            this.trigger('search-button-did-click', {
                'searchText' : this.getUI('searchTxt').val()
            });

            var ui1 = this.getUI('reopenButton');
            ui1.hide();
        },
        _toggleButton_clickHandler : function () {
            var ui = this.getUI('toggleButton');
            ui.hide();
            this.trigger('search-toggle-did-click');

            var ui1 = this.getUI('reopenButton');
            ui1.show();
        },
        _reopenButton_clickHandler : function () {
            var ui = this.getUI('reopenButton');
            ui.hide();
            this.trigger('search-reopen-did-click');

            var ui1 = this.getUI('toggleButton');
            ui1.show();
        }
    });

    return V;
});