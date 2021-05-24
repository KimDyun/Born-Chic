var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/:category',function (req, res,next){
    var category = req.params.category;

    var sqlForSelectList = "SELECT * FROM ITEM WHERE category = ?";
    connection.query(sqlForSelectList,[category], function (err, rows){
        if (err) console.error("err : " + err);
        console.log("rows : "+ JSON.stringify(rows));
        res.render('itemlist', {rows: rows});
    });
});
module.exports = router;
