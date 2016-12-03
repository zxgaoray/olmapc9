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
            this.barView.render();

            //搜索分类
            this.classifyView = new ClassifyView({
            });
            //this.classifyView.render();

            //搜索结果列表
            this.resultView = new ResultView({
            });
            //this.resultView.render();

            this.getRegion('bar').show(this.barView);

        },
        _doSearch : function (evt) {
            console.log(evt);

        },
        _testData : function () {
            var data = [];
            for (var i = 0; i < 30; i++) {
                data.push({
                    name : ''
                })
            }
        }

    });
    
    return SearchView;
})