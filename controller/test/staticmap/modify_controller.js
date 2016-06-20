exports.clusterPoints = function(req, res, next){
    res.json(createClusterPoints());
}

exports.animatedClusterPoints = function (req, res, next) {
    var offset = req.offset;
    console.log(offset);
    res.json(createAnimatedClusterPoints(0.01));
}



function createClusterPoints(offset) {
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

function createAnimatedClusterPoints (offset) { 
    var arr = [];
    
    for (var i=0; i < 100; i++) {
        var point = {
            code:'code_'+i,
            name:'item_'+i,
            lon:120.25 + Math.random()*offset,
            lat:30.25 + Math.random()*offset
        }
        
        arr.push(point);
    }
    
    return arr;
}