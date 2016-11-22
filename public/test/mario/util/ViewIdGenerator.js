//创建视图的id
define('test/mario/util/ViewIdGenerator',
[
],
function(){
    var incMid = 0;
    var generator = {
        generate : function() {
            incMid ++;
            var mid = incMid;
            return mid;
        }
    }
    
    return generator;
})