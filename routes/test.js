var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ol2', function(req, res, next) {
  res.render('test/ol2/ol2');
});

router.get('/ol3', function(req, res, next) {
  res.render('test/ol3/ol3');
});

router.get('/leaf', function(req, res, next) {
  res.render('test/leaf/leaf');
});

router.get('/ags', function(req, res, next) {
  res.render('test/ags/ags');
});

router.get('/staticmap', function(req, res, next) {
  res.render('test/staticmap/index');
});

router.get('/ags3d', function(req, res, next) {
    res.render('test/ags3d/index');
})

module.exports = router;