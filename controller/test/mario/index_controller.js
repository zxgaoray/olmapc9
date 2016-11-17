exports.index = function(req, res, next){
    res.render("test/mario/index.pug", {
        title : "map",
        debug : true
    });
}