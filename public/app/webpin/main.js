require.config({
    paths:{
        'jquery':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
		,'underscore':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
		,'backbone':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
		,'bootstrap':'https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min'
		,'text':'https://cdn.bootcss.com/require-text/2.0.12/text.min'
		,'app':'/app'
    },
    shim:{
        'bootstrap':['jquery']
    }
})

require(
[
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'app/webpin/view/PinView'
    ,'bootstrap'
    
    
],
function($, _, Backbone, PinView){
    var pinView = new PinView();
    pinView.fetchData();
})