var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webpins', function(req, res, next) {
    res.json({
        list:[
            {
                code:'webpin1',
                name:'ol2',
                pin:'/test/ol2',
                descript:''
            },
            {
                code:'webpin2',
                name:'ol3',
                pin:'/test/ol3',
                descript:''
            },
            {
                code:'webpin3',
                name:'leaflet',
                pin:'/test/leaf',
                descript:''
            },
            {
                code:'webpin4',
                name:'ags',
                pin:'/test/ags',
                descript:''
            }
        ]
    });
})

module.exports = router;
