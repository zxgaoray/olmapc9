define('test/staticmap/util/AnimatedClusterStrategy',
[
],
function(){
    var Clazz = OpenLayers.Class(OpenLayers.Strategy.Cluster, {
        CLASS_NAME:'test.staticmap.util.AnimatedClusterStrategy',
        animationMethod:OpenLayers.Easing.Expo.easeOut,
        animationDuration:20,
        animationTween:null,
        previousResolution:null,
        previousClusters:null,
        animating:false,
        zoomIn:true,
        
        initialize:function(options){
            OpenLayers.Strategy.Cluster.prototype.initialize.apply(this, arguments);
            
            if (options.animationMethod) {
                this.animationMethod = options.animationMethod;
            }
        },
        destroy:function(){
            if (this.animationTween) {
                this.animationTween.stop();
                this.animationTween = null;
            }
        },
        cluster:function(event){
            var resolution = this.layer.map.getResolution();
            var isPan = (event && event.type == 'moveend' && !event.zoomChanged);
            
            if (this.animating && (resolution == this.resolution)) {
                return;
            }
            
            if ((!event || event.zoomChanged || isPan) && this.features){
                if (resolution != this.resolution || !this.clustersExist() || isPan) {
                    if (resolution != this.resolution) {
                        this.zoomIn = (!this.resolution || (resolution <= this.resolution));
                    }
                    
                    this.previousResolution = this.resolution;
                    this.previousClusters = this.clusters;
                    this.resolution = resolution;
                    
                    var clusters = [];
                    var feature, clustered, cluster;
                    
                    for (var i=0; i < this.features.length; ++i) {
                        feature = this.features[i];
                        
                        //feature的几何图形是否在可视区域内
                        if (this.layer && this.layer.map) {
                            var screenBounds = this.layer.map.getExtent();
                            var featureBounds = feature.geometry.getBounds();
                            
                            if (!screenBounds.intersectsBounds(featureBounds)){
                                continue;
                            }
                        }
                        
                        if (feature.geometry) {
                            clustered = false;
                            for (var j=clusters.length-1;j>0;--j) {
                                cluster = clusters[j];
                                if (this.shouldCluster(cluster, feature)){
                                    this.addToCluster(cluster, feature);
                                    clustered = true;
                                    break;
                                }
                            }
                            if (!clustered) {
                                clusters.push(this.createCluster(this.features[i]));
                            }
                        }
                        
                    }
                    
                    if (clusters.length > 0) {
                        if (this.threshold > 1) {
                            var clone = clusters.slice();
                            clusters = [];
                            var candidate;
                            
                            for (var i=0, len=clone.length;i<len;++i) {
                                candidate = clone[i];
                                
                                if (candidate.attributes.count < this.threshold) {
                                    Array.prototype.push.apply(clusters, candidate.cluster);
                                } else {
                                    clusters.push(candidate);
                                }
                            }
                        }
                    }
                    
                    this.clusters = clusters;
                    
                    this.clustering = true;
                    
                    this.layer.removeAllFeatures();
                    
                    
                    if (this.zoomIn || !this.previousClusters) {
                        this.layer.addFeatures(this.clusters);
                    }else {
                        this.layer.addFeatures(this.previousClusters);
                    }
                    
                    this.clustering = false;
                    
                    if (this.clusters.length > 0 && this.previousClusters) {
                        if (this.animationTween) {
                            this.animationTween = false;
                        }
                        
                        var clustersA, clustersB;
                        if (this.zoomIn) {
                            clustersA = this.clusters;
                            clustersB = this.previousClusters;
                        } else {
                            clustersA = this.previousClusters;
                            clustersB = this.clusters;
                        }
                        
                        for (var i=0; i < clustersA.length; i++) {
                            var ca = clustersA[i];
                            var cb = this.findFeaturesInClusters(ca.cluster, clustersB);
                            
                            if (cb) {
                                ca._geometry = {};
                                
                                if (this.zoomIn) {
                                    ca._geometry.origx = cb.geometry.x;
                                    ca._geometry.origy = cb.geometry.y;
                                    ca._geometry.destx = ca.geometry.x;
                                    ca._geometry.desty = ca.geometry.y;
                                    
                                    ca.geometry.x = ca._geometry.origx;
                                    ca.geometry.y = ca._geometry.origy;
                                } else {
                                    ca._geometry.origx = ca.geometry.x;
                                    ca._geometry.origy = ca.geometry.y;
                                    ca._geometry.destx = cb.geometry.x;
                                    ca._geometry.desty = ca.geometry.y;
                                }
                            }
                        }
                        
                        //panning do not animate the cluster
                        if (isPan && !this.animating) {
                            this.layer.redraw();
                            return;
                        }
                        
                        if (!this.animationTween) {
                            this.animationTween = new OpenLayers.Tween(this.animationMethod);
                        }
                        
                        this.animating = true;
                        this.animationTween.start({
                            x:0.0,
                            y:0.0
                        }, {
                            x:1.0,
                            y:1.0
                        }, this.animationDuration, {
                            callbacks:{
                                eachStep : OpenLayers.Function.bind(this.animate, this),
                                done : OpenLayers.Function.bind(function(delta){
                                    this.animate(delta);
                                    
                                    var clusters = this.zoomIn ? this.clusters : this.previousClusters;
                                    
                                    for (var i=0; i < clusters.length; i++) {
                                        delete clusters[i].cluster._geometry;
                                    }
                                    
                                    if (!this.zoomIn) {
                                        this.clustering = true;
                                        this.layer.removeFeatures(this.previousClusters);
                                        this.layer.addFeatures(this.clusters);
                                        this.clustering = false;
                                        
                                    }
                                    
                                    this.animating = false;
                                    
                                }, this)
                            }
                        });
                    }
                    
                }
            }
        },
        findFeaturesInClusters:function(features, clusters){
            for (var i=0; i < features.length; i++) {
                var feature = features[i];
                
                for (var j=0; j < clusters.length; j++) {
                    var cluster = clusters[j];
                    var clusterFeatures = clusters[j].cluster;
                    
                    for (var k=0; k < clusterFeatures.length; k++) {
                        if (feature.id == clusterFeatures[k].id) {
                            return cluster;
                        }
                    }
                }
            }
            
            return null;
        },
        animate:function(delta){
            var clusters = this.zoomIn ? this.clusters : this.previousClusters;
            
            for (var i=0; i < clusters.length; i++) {
                if (!clusters[i]._geometry) continue;
                
                var dx = (clusters[i]._geometry.destx - clusters[i]._geometry.origx) * delta.x;
                var dy = (clusters[i]._geometry.desty - clusters[i]._geometry.origy) * delta.y;
                
                clusters[i].geometry.x = clusters[i]._geometry.origx + dx;
                clusters[i].geometry.y = clusters[i]._geometry.origy + dy;
            }
            
            this.layer.redraw();
        },
        shouldCluster:function(cluster, feature, previousResolution){
            var res = previousResolution ? this.previousResolution : this.resolution;
            var cc = cluster.geometry.getBounds().getCenterLonLat();
            var fc = cluster.geometry.getBounds().getCenterLonLat();
            
            var distance = (Math.sqrt(Math.pow((cc.lon - fc.lon), 2) + Math.pow((cc.lat - fc.lat), 2)));
            
            return (distance <= this.distance);
        }
    })
    
    return Clazz;
})