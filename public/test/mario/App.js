define('test/mario/App',
[
    'underscore',
    'backbone',
    'backbone.radio',
    'marionette'
],
function(_, Bb, BbRadio, Mn){
    var App = Mn.Application.extend({
        //初始化
        initialize : function() {
            
        },
        //启动app之前
        onBeforeStart : function() {
            
        },
        //启动App
        onStart : function() {
            console.log("on start");
            
            Bb.history.start();
        }
    });
    
    
    
    
    return App;
});