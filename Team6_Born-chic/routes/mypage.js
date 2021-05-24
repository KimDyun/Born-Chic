var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res, next){
    var id = req.cookies.id;
    var sqlForInsertList = "select i_code, i.image, i_name, i.price, b_date, b.delivery from item as i, buy as b where i_code = b_code and b.delivery <=0 and b_id = ?";
    connection.query(sqlForInsertList,[id],function (err, rows) {
        if (err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));
        res.render('mypage', {rows: rows});
    });
});
router.post('/', function (req, res){
    var id = req.cookies.id;
    var item_code = req.body.i_code;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var date_form = year + '-' + month + '-' + day;

    var sqlForUpdateList = "UPDATE item SET sell = sell+1, stock = stock-1 WHERE i_code = ?";
    connection.query(sqlForUpdateList, [item_code],function (err, check_item){
        var item_success = check_item.changedRows;
        if (err) console.error("err : " + err);
        if(item_success == 0) console.error("item database setting is failed");

        sqlForUpdateList = "UPDATE buy SET delivery = 0, b_count = b_count+1, b_date = ? WHERE b_id = ? and b_code = ?";
        connection.query(sqlForUpdateList,[date_form,id,item_code] ,function (err, check){
            var purchase_success = check.changedRows;
            if (err) console.error("err : " + err);
            if(purchase_success == undefined){
                res.send({data:"Purchase error"});}
            else{
                res.send({data:"Purchase success"});}
        });
    });
});

module.exports = router;