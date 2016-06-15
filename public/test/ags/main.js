require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/ImageryLayer",
        "esri/layers/support/RasterFunction",
        "esri/PopupTemplate",
        "dojo/domReady!"
      ],
      function(
        Map, MapView, ImageryLayer,
        RasterFunction, PopupTemplate
      ) {
        /***************************************
         * Set up popup template of image layer
         **************************************/

        var imagePopupTemplate = new PopupTemplate({
          title: "Data from {SensorName} satellite",
          content: "Rendered RGB values: <b>{Raster.ServicePixelValue} </b>" +
            "<br>Original values (B, G, R, NIR): <b>{Raster.ItemPixelValue} </b>"
        });

        /*******************************************************************
         * Create image layer with server defined raster function templates
         ******************************************************************/

        var serviceRFT = new RasterFunction({
          functionName: "TorontoFalseColor",
          variableName: "Raster"
        });

        var layer = new ImageryLayer({
          url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Toronto/ImageServer",
          renderingRule: serviceRFT,
          popupTemplate: imagePopupTemplate
        });

        /*************************
         * Add image layer to map
         ************************/

        var map = new Map({
          basemap: "hybrid",
          layers: [layer]
        });

        var view = new MapView({
          container: "viewDiv",
          map: map,
          center: { // autocasts as esri/geometry/Point
            x: -8836932.6501,
            y: 5411004.902699997,
            spatialReference: 3857
          },
          zoom: 13,
          popup: {
            actions: []
          },
        });
      }
    );