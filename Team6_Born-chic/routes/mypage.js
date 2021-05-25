var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res, next){
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var sqlForInsertList = "select i_code, i.image, i_name, i.price, b_date, b.delivery from item as i, buy as b where i_code = b_code and b.delivery <=0 and b_id = ?";
    connection.query(sqlForInsertList,[id],function (err, rows) {
        if (err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));
        res.render('mypage', {user_id: id, admin: admin ,rows: rows});
    });
});
router.post('/', function (req, res){
    var id = req.cookies.id;
    var buy_count = req.body.b_count;
    var item_code = req.body.i_code;
    var buy_code = req.body.b_code;

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var date_form = year + '-' + month + '-' + day;

    if(item_code != undefined && buy_count == undefined && buy_code == undefined){
        var sqlForDeleteList = "DELETE From buy WHERE b_id = ? and b_code = ? and delivery = -1";
        connection.query(sqlForDeleteList, [id, item_code], function (err, check) {
            console.log(check);
            var purchase_success = check.changedRows;
            if (err) console.error("err : " + err);
            if (purchase_success == undefined) {
                res.send({data: "delete error"});
            } else {
                res.send({data: "delete success"});
            }
        });
    }

    if(item_code != undefined && buy_count != undefined && buy_code == undefined) { // 장바구니에서 상품 구매 시
        var sqlForUpdateList = "UPDATE item SET sell = sell+?, stock = stock-? WHERE i_code = ?";
        connection.query(sqlForUpdateList, [buy_count, buy_count, item_code], function (err, check_item) {
            console.log(check_item);
            var item_success = check_item.changedRows;
            if (err) console.error("err : " + err);
            if (item_success == 0) console.error("item database setting is failed");

            sqlForUpdateList = "UPDATE buy SET delivery = 0, b_date = ? WHERE b_id = ? and b_code = ? and delivery = -1";
            connection.query(sqlForUpdateList, [date_form, id, item_code], function (err, check) {
                var purchase_success = check.changedRows;
                if (err) console.error("err : " + err);
                if (purchase_success == undefined) {
                    res.send({data: "Purchase error"});
                } else {
                    res.send({data: "Purchase success"});
                }
            });
        });
    }
    if(buy_code !=undefined && item_code == undefined && buy_count == undefined){ // 배송 목록에서 배송 완료 상품 삭제 시
        var sqlForUpdateList = "UPDATE buy SET delivery = 3 WHERE b_code = ?";
        connection.query(sqlForUpdateList, [buy_code], function (err, check) {
            console.log(check);
            var purchase_success = check.changedRows;
            if (err) console.error("err : " + err);
            if (purchase_success == undefined) {
                res.send({data: "delete error"});
            } else {
                res.send({data: "delete success"});
            }
        });
    }
});

module.exports = router;