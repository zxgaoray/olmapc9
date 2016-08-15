define('olext/layer/cache/GaodeTiledCache',
[
    'OpenLayers'
],
function(OpenLayers){
    var GaodeTiledCache = OpenLayers.Class(OpenLayers.Layer.TMS,{

    	type : "GaodeLayerCache",
    	token : null,
    	numZoomLevels : null,
    	myResolutions : [156543.0339,
    	            78271.516953125,
    	            39135.7584765625,
    	            19567.87923828125,
    	            9783.939619140625,
    	            4891.9698095703125,
    	            2445.9849047851562,
    	            1222.9924523925781,
    	            611.4962261962891,
    	            305.74811309814453,
    	            152.87405654907226,
    	            76.43702827453613,
    	            38.218514137268066,
    	            19.109257068634033,
    	            9.554628534317016,
    	            4.777314267158508,
    	            2.388657133579254,
    	            1.194328566789627,
    	            0.5971642833948135],

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
    		//this.buildBasicInfo(url);
    		OpenLayers.Layer.TMS.prototype.initialize.apply(this, [name, url, options]);
    	},
    	buildBasicInfo:function(url){
    		var urlpath = url.split("/");
    		var type = urlpath[urlpath.length-2];
    		this.basicInfoLayer = type.substring(0,type.indexOf("_"));
    		this.basicInfoTileMatrixSet = type.substring(type.indexOf("_")+1,type.length);
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
    		var res = this.getResolution();
    		var x = parseInt((bounds.getCenterLonLat().lon - this.tileOrigin.lon) / (256 * res));
    		var y = parseInt((this.tileOrigin.lat - bounds.getCenterLonLat().lat) / (256 * res));
    		var z = this.map.getZoom();
    		if (Math.abs(this.myResolutions[z] - res) > 0.0000000000000000001) {
    	    	for (var i = 0; i < this.myResolutions.length; i++) {
    	       		if (Math.abs(this.myResolutions[i] - res) <= 0.0000000000000000001) {
    	            	z = i;
    	            	break;
    	        	}
    	 		}

    	 		if (OpenLayers.Util.isArray(this.url)) {
    	    		var serverNo = parseInt( Math.GetRandomNum(0, this.url.length-1));
    	    		var path=this.url[serverNo].replace(new RegExp("\\${z\\}","g"),z).replace(new RegExp("\\${x\\}","g"),x).replace(new RegExp("\\${y\\}","g"),y);
    	    		return path
    			}else{
    	    		var path = this.url.replace(new RegExp("\\${z\\}","g"),z).replace(new RegExp("\\${x\\}","g"),x).replace(new RegExp("\\${y\\}","g"),y);
    				return path
    			}

    		}
    	},

    	clone : function(obj) {
    		if (obj == null) {
    			obj = new GaodeTiledCache(this.name, this.url, this.getOptions());
    		}
    		//ArcGISCache
    		obj = OpenLayers.Layer.TMS.prototype.clone.apply(this, [obj]);
    		return obj;
    	},
    	CLASS_NAME: "olext.layer.cache.GaodeTiledCache"
    });
    
    return GaodeTiledCache;
})