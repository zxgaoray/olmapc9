var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('app/olmap/index');
});

router.get('/olmap', function(req, res, next) {
  res.render('app/olmap/index');
});


module.exports = router;
