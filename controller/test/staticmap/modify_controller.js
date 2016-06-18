exports.clusterPoints = function(req, res, next){
    res.json(createClusterPoints());
}



function createClusterPoints() {
    var arr = [];
    
    for (var i=0; i < 100; i++) {
        var point = {
            code:'code_'+i,
            name:'item_'+i,
            lon:120.25 + Math.random()*0.002,
            lat:30.25 + Math.random()*0.002
        }
        
        arr.push(point);
    }
    
    return arr;
}