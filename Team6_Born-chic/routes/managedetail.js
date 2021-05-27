var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/:i_code', function (req, res, next){
    var item_code = req.params.i_code;
    console.log(item_code);
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    if(item_code != undefined) { // item code가 있으면 물품 수정
        var sqlForInsertList = "SELECT i_code, i_name, category, image, price FROM item WHERE i_code = ?";
        connection.query(sqlForInsertList, [item_code], function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.render('managedetail', {user_id: id, admin: admin, rows: rows});
        });
    }
});
router.get('/', function (req, res, next){
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    console.log("hi")
    res.render('itemupload', {user_id: id, admin: admin});
});

router.post('/itemupload', function(req,res,next){

});
module.exports = router;