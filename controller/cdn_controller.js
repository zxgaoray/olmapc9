exports.list = function(req, res, next){
    res.json(cdnList());
}




function cdnList (){
    return [
        {
            'id':'00001',
            'name':'jquery',
            'css':'',
            'js':'https://cdn.bootcss.com/jquery/1.12.4/jquery.min'
        },
        {
            'id':'00002',
            'name':'underscore',
            'css':'',
            'js':'https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min'
        },
        {
            'id':'00003',
            'name':'backbone',
            'css':'',
            'js':'https://cdn.bootcss.com/backbone.js/1.3.3/backbone-min'
        },
        {
            'id':'00004',
            'name':'bootstrap 3',
            'css':'https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css',
            'js':'https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min'
        },
        {
            'id':'00005',
            'name':'require.js',
            'css':'',
            'js':'https://cdn.bootcss.com/require.js/2.2.0/require.min.js'
        },
        {
            'id':'00006',
            'name':'text',
            'css':'',
            'js':'https://cdn.bootcss.com/require-text/2.0.12/text.min'   
        },
        {
            'id':'00007',
            'name':'openlayers 3',
            'css':'https://cdn.bootcss.com/ol3/3.16.0/ol.css',
            'js':'https://cdn.bootcss.com/ol3/3.16.0/ol'
        },
        {
            'id':'00008',
            'name':'openlayers 2',
            'css':'https://cdn.bootcss.com/openlayers/2.13.1/theme/default/style.css',
            'js':'https://cdn.bootcss.com/openlayers/2.13.1/lib/OpenLayers.js'
        },
        {
            'id':'00009',
            'name':'leaflet',
            'css':'https://cdn.bootcss.com/leaflet/1.0.0-rc.1/leaflet.css',
            'js':'https://cdn.bootcss.com/leaflet/1.0.0-rc.1/leaflet'
        },
        {
            'id':'00010',
            'name':'arcgis api for js 4.0',
            'css':'https://js.arcgis.com/4.0/esri/css/main.css',
            'js':'https://js.arcgis.com/4.0/'
        }
        /*
        {
            'id':'99999',
            'name':'',
            'css':'',
            'js':''
        }
        */
    ];
}