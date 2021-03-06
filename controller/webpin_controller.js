exports.list = function(req, res, next) {
    res.json(webpinList());
}


function webpinList() {
    return {
        list:[
            {
                code:'webpin1',
                name:'ol2',
                pin:'/test/ol2',
                denpences:'requirejs backbone leaflet',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1061274&size=128'
            },
            {
                code:'webpin2',
                name:'ol3',
                pin:'/test/ol3',
                denpences:'requirejs backbone openlayers3',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1061273&size=128'
            },
            {
                code:'webpin3',
                name:'leaflet',
                pin:'/test/leaf',
                denpences:'requirejs backbone leaflet',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1185657&size=128'
            },
            {
                code:'webpin4',
                name:'ags',
                pin:'/test/ags',
                denpences:'requirejs backbone arcgis_js_api',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1195280&size=128'
            },
            {
                code:'webpin5',
                name:'static map',
                pin:'/test/staticmap',
                denpences:'requirejs backbone openlayers2',
                descript:'static map',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1185657&size=128'
            },
            {
                code:'webpin6',
                name:'ags 3d',
                pin:'/test/ags3d',
                denpences:'requirejs backbone arcgis_js_api',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1195280&size=128'
            },
            {
                code:'webpin7',
                name:'drawn',
                pin:'/test/drawn',
                denpences:'requirejs backbone openlayers2',
                descript:'',
                img:'http://www.easyicon.net/api/resizeApi.php?id=1195280&size=128'
            }
        ]
    }
}