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
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1061274&size=128'
            },
            {
                code:'webpin2',
                name:'ol3',
                pin:'/test/ol3',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1061273&size=128'
            },
            {
                code:'webpin3',
                name:'leaflet',
                pin:'/test/leaf',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1185657&size=128'
            },
            {
                code:'webpin4',
                name:'ags',
                pin:'/test/ags',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1195280&size=128'
            },
            {
                code:'webpin5',
                name:'static map',
                pin:'/test/staticmap',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1185657&size=128'
            }
        ]
    });
})

module.exports = router;
