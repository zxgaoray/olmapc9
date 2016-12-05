//视图：搜索
define('test/mario/view/SearchView',
[
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette',
    'test/mario/util/ViewIdGenerator',
    'test/mario/view/search/BarView',
    'test/mario/view/search/ClassifyView',
    'test/mario/view/search/ResultView'
],
function(_, Backbone, Radio, Marionette, Vig,
    BarView, ClassifyView, ResultView){
    var SearchView = Marionette.View.extend({
        initialize : function() {
            this.mid = Vig.generate();  
        },
        templateContext : function() {
            return {
                mid : this.getOption('mid')
            }  
        },
        onRender : function() {
            var mid = this.getOption('mid');
            this.addRegions({
                'bar' : '#search-searchbar-' + mid,
                'classify' : '#search-classify-' + mid,
                'result' : '#search-result-' + mid
            });

            console.log(this.getRegion('bar'));


            //搜索条
            this.barView = new BarView({
            });
            this.listenTo(this.barView, 'search-button-did-click', this._doSearch);
            this.listenTo(this.barView, 'search-toggle-did-click', this._doListToggle);
            this.listenTo(this.barView, 'search-reopen-did-click', this._doListReopen);
            this.barView.render();

            //搜索分类
            this.classifyView = new ClassifyView({
            });
            //this.classifyView.render();

            //搜索结果列表
            this.resultView = new ResultView({
                mid : Vig.generate()
            });


            this.getRegion('bar').show(this.barView);

        },
        _doSearch : function (evt) {
            console.log(evt);

            this.resultView.render();
            this.getRegion('result').show(this.resultView);

            this.resultView.renderResult(this._testData());

            this.barView.showToggleButton();

        },
        _doListToggle: function () {
            this.resultView.hideResult();
        },
        _doListReopen : function () {
            this.resultView.showResult();
        },
        _testData : function () {
            var data = [];
            for (var i = 0; i < 30; i++) {
                data.push({
                    name : 'name' + i,
                    code : 'code' + i,
                    des : 'des' + i,
                    type : 'feature'
                })
            }
            return data;
        }

    });
    
    return SearchView;
})