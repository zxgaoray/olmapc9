define('test/mario/util/Channel',
[
    'underscore',
    'backbone',
    'backbone.radio'
],
function(_, Backbone, Radio){
    return {
        //定义频道
        GLOBAL_APP : 'global-app',
        GLOBAL_MAP : 'global-map',
        
        //获取频道
        getChannel : function(name) {
            return Radio.channel(name);
        }
    }
});