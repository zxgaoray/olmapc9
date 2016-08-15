define('olext/layer/BaiduTiledLayer',
[
    'OpenLayers'
],
function(OpenLayers) {
    var BaiduTiledLayer = OpenLayers.Class(OpenLayers.Layer.TMS,{
    	type : "BaiduTiledlayer",
    	token : null,
    	numZoomLevels : null,
    	tileOrigin : new OpenLayers.LonLat(0, 0),
    	myResolutions : [262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1,0.5],
    	basicInfoStyle:"default",
    	basicInfoFormat:"tiles",
    	basicInfoLayer:"",
    	basicInfoTileMatrixSet:"",

    	tileOptions : {
    		blankImageUrl : "", // 空白图片
    		onImageError : function() { // 切片数据加载失败使用空白图片代替
    			var img = this.imgDiv;
    			if (img.src != null) {
    				this.imageReloadAttempts++;
    				if (this.imageReloadAttempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
    					this.setImgSrc(this.layer.getURL(this.bounds));
    				} else {
    					OpenLayers.Element.addClass(img, "olImageLoadError");
    					img.src = "";
    					this.events.triggerEvent("loaderror");
    					this.onImageLoad();
    				}
    			}
    		}
    	},

    	initialize : function(name, url, options) {
    		OpenLayers.Layer.TMS.prototype.initialize.apply(this, [name, url, options]);
    	},
    	/**
    	 * 获得连接的url
    	 *
    	 * @protected
    	 * @param {}
    	 *            bounds
    	 * @return {}
    	 */
    	getURL : function(bounds) {
    		var z = this.map.getZoom();
           	// var res = this.map.getResolution();
           	var res = this.getResolution();
           	//var res = this.myResolutions[z];
          	var size = this.tileSize;
            var bx = Math.floor((bounds.left - this.tileOrigin.lon) / (res * size.w));
            var by = Math.floor((bounds.bottom - this.tileOrigin.lat) / (res * size.h));
            var x = bx.toString().replace("-","M");
         	var y = by.toString().replace("-","M");

           	var strURL = "";

           	if (Math.abs(this.myResolutions[z] - res) > 0.0000000000000000001) {
    	    	for (var i = 0; i < this.myResolutions.length; i++) {
    	       		if (Math.abs(this.myResolutions[i] - res) <= 0.0000000000000000001) {
    	            	z = i;
    	            	break;
    	        	}
    	 		}
    	 	}

         	if(OpenLayers.Util.isArray(this.url)){
         		var serverNo = parseInt(Math.GetRandomNum(0, this.url.length-1));
         		strURL= this.url[serverNo] + '?qt=tile&x='+x + '&y=' + y + '&z=' + z+'&styles=pl';
         	}else{
         		strURL= this.url + '?qt=tile&x='+x + '&y=' + y + '&z=' + z+'&styles=pl';
         	}
         	//console.info("old url : " + strURL);
         	return strURL;
    	},
    	clone : function(obj) {
    		if (obj == null) {
    			obj = new BaiduTiledLayer(this.name, this.url, this.getOptions());
    		}
    		//ArcGISCache
    		obj = OpenLayers.Layer.TMS.prototype.clone.apply(this, [obj]);
    		return obj;
    	},
    	CLASS_NAME: "olext.layer.BaiduTiledLayer"

    });
    
    return BaiduTiledLayer;
})