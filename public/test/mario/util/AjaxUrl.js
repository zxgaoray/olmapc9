//ajax请求的地址
define('test/mario/util/AjaxUrl',
[],
function(){
    var ctx = __ctx || "";
    return {
        //获取context path
        getCtx : function() {
            return ctx;  
        },
        //主模板
        url_main_template : ctx + '/test/mario/template/template.html'
    }
})