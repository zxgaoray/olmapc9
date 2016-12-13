define('test/mario/view/search/ResultView',
[
    'jquery',
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/util/ViewIdGenerator'
],
function ($, _, Bb, BbRadio, Mn, Vig) {
    var ItemView = Mn.View.extend({
        tagName: 'li',
        className : 'list-group-item ng-search-result-list-item',
        template : '#tpl-search-controller-search-result-item',
        triggers : {
            click : 'item:click'
        }

    });

    var CollectionView = Mn.CollectionView.extend({
        tagName : 'ul',
        className : 'list-group elements-list',
        childView : ItemView,
        childViewEvents : {
            'item:click' : '_listItem_clickHandler'
        },
        _listItem_clickHandler : function (childView) {
            //.ng-search-result-list-item
            $('.ng-search-result-list-item').removeClass('active');
            $(childView.el).addClass('active');
            console.log(childView.model);
            this.trigger('item:click', {
                item : childView.model
            });
        }
    });

    var ResultView = Mn.View.extend({
        template : '#tpl-search-controller-search-result',
        initialize : function () {
            this.resultListCollection = new Bb.Collection([]);
        },
        templateContext : function() {
            return {
                mid : this.getOption('mid')
            }
        },
        regions : function() {
            return {
                list: {
                    el: '#search-list-ul-' + this.getOption('mid'),
                    replaceElement: true
                }
            }
        },
        ui : function() {
            return {
                'close': '#search-list-close-' + this.getOption('mid')
            }
        },
        events : function() {
            return {
                'click @ui.close': '_ui_close_clickHandler'
            }
        },
        onRender : function () {
            this.resultListView = new CollectionView({
                collection : this.resultListCollection
            });
            this.listenTo(this.resultListView, 'item:click', this._resultListItem_clickHandler);
        },
        renderResult : function (data) {
            if (!this.resultListView) return;

            this.resultListCollection.reset(data);
            this.resultListView.render();

            this.getRegion('list').show(this.resultListView);

            if ($(this.el).css('display') === 'none') {
                this.showResult();
            }
        },
        showResult : function () {
            $(this.el).show();
        },
        hideResult : function () {
            $(this.el).hide();
        },
        _ui_close_clickHandler : function () {
            $(this.el).hide();
        },
        _resultListItem_clickHandler : function (data) {
            console.log(data);
        }

    });
    
    return ResultView;
});