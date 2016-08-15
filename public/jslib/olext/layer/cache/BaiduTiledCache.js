define('olext/layer/cache/BaiduTiledCache',
[
    'OpenLayers'
],
function(OpenLayers){
    var BaiduTiledCache = OpenLayers.Class(OpenLayers.Layer.TileCache, {
        type : 'BaiduTiledCache'
    	, options:null
    	, url:null
        , maxExtent:new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
        , tileOrigin:new OpenLayers.LonLat(43.88955327932,12.590178885765)
    	, tileSize: new OpenLayers.Size(256, 256)
    	, tileOptions : {
    		blankImageUrl : "", 
    		onImageError : function() {
    			var img = this.imgDiv;
    			if (img.src != null) {
    				this.imageReloadAttempts++;
    				if (this.imageReloadAttempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
    					this.setImgSrc(this.layer.getURL(this.bounds));
    				} else {
    					OpenLayers.Element.addClass(img, "olImageLoadError");
    					this.events.triggerEvent("loaderror");
    					img.src = "";
    					this.onImageLoad();
    				}
    			}
    		}
    	}

    	, _serverResolutions:[
            156543.033928,
           78271.5169639999,
           39135.7584820001,
           19567.8792409999,
           9783.93962049996,
           4891.96981024998,
           2445.98490512499,
           1222.99245256249,
           611.49622628138,
           305.748113140558,
           152.874056570411,
           76.4370282850732,
           38.2185141425366,
           19.1092570712683,
           9.55462853563415,
           4.77731426794937,
           2.38865713397468,
           1.19432856685505,
           0.597164283559817,
           0.298582141647617
        ]
    	, initialize : function(name, url, options) {
    		var tempoptions = OpenLayers.Util.extend({
    				'format': 'image/png'
    			},
    			options);
    		OpenLayers.Layer.TileCache.prototype.initialize.apply(this, [name, url, {},tempoptions]);
    		this.extension = this.format.split('/')[1].toLowerCase();
    		this.extension = (this.extension == 'jpg') ? 'jpeg' : this.extension;
    		this.transitionEffect = "resize";
    		this.buffer = 0;
    	}
    	, getURL : function(bounds) {
    		var z = this.map.getZoom();
           	var res = this.map.getResolution();
          	var size = this.tileSize;
            var bx = Math.round((bounds.left - this.tileOrigin.lon) / (res * size.w));
            var by = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * size.h));
            var x = bx.toString().replace("-","M");
         	var y = by.toString().replace("-","M");

           	var strURL = "";
         	if(OpenLayers.Util.isArray(this.url)){
         		var serverNo = parseInt(Math.GetRandomNum(0, this.url.length - 1));
         		strURL= this.url[serverNo] + '/'+z + '/' + x + '/' + y+'.png';
         	}else{
         		strURL= this.url + '/'+z + '/' + x+ '/' + y+'.png';
         	}
         	return strURL;
    	}
    	, clone: function (obj) {
    		if (obj == null) {
    			obj = new BaiduTiledCache(this.name, this.url, this.options);
    		}
    		obj = OpenLayers.Layer.TileCache.prototype.clone.apply(this, [obj]);
    		return obj;
    	}
    	, CLASS_NAME: "olext.layer.cache.BaiduTiledCache"
    });
    
    return BaiduTiledCache;
})