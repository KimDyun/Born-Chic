var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res, next){
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var sqlForInsertList = "";
    connection.query(sqlForInsertList,[id],function (err, rows) {
        if (err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));
        res.render('mypage', {user_id:id, admin:admin, rows: rows});
    });
});

module.exports = router;