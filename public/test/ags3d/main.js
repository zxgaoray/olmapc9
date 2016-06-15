require([
  "esri/Map",
  "esri/views/SceneView",
  "dojo/domReady!"
], function(Map, SceneView) {
  var map = new Map({
    basemap: "streets",
    ground: "world-elevation"
  });
  var view = new SceneView({
    container: "viewDiv",  // Reference to the DOM node that will contain the view
    map: map  // References the map object created in step 3
  });
});