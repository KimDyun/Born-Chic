var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


router.get('/:i_code',function (req, res,next){
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var i_code = req.params.i_code;
    var sqlForSelectList = "SELECT * FROM ITEM WHERE i_code=?";
    connection.query(sqlForSelectList,[i_code] ,function (err, data){
        if (err) console.error("err : " + err);
        var date = new Date(data[0].i_date);
        date = date.getFullYear() + '년 ' + (date.getMonth()+1) + '월 ' + date.getDate() + '일';
        res.render('itemdetail', {user_id : id, admin: admin, rows: data, date:date});
    });
});

router.post('/:i_code', function (req, res){
    var search = req.body.search;
    res.redirect('/itemlist/search/1/'+search);
});

router.get('/shopping/cart/:buy_count/:i_code',function (req, res,next){
    var i_code = req.params.i_code;
    var buy_count = req.params.buy_count;

    var sqlForSelectList = "SELECT count(*) FROM ITEM";
    connection.query(sqlForSelectList,function (err, data){
        if (err) console.error("err : " + err);
        res.redirect('/itemdetail/'+i_code);
    });
});

module.exports = router;
