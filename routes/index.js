var express = require('express');
var router = express.Router();

var webpinCtlr = require('../controller/webpin_controller');
var cdnCtlr = require('../controller/cdn_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webpins', webpinCtlr.list);

router.get('/cdnlist', cdnCtlr.list);

module.exports = router;
