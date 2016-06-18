define('app/staticmap/util/ClusterLayer',
[
],
function(){
    var Clazz = OpenLayers.Class(OpenLayers.Strategy.Cluster, {
        CLASS_NAME:'app.staticmap.util.ClusterLayer',
        selectControl:null,
        selectOnHover:true,
        selectOnClick:false
    })
})