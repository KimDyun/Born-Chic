var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res, next) {
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var sqlForInsertList = "select idx, B.b_id, B.delivery, B.b_count, I.i_name, I.category, I.stock, I.sell, I.image, I.price from BUY as B JOIN ITEM as I on I.i_code = B.b_code where delivery=0 or delivery=1 or delivery=2 ;";
    connection.query(sqlForInsertList, function (err, rows) {
        if (err) console.error("err : " + err);
        var sqlForInsertList = "select * from ITEM";
        connection.query(sqlForInsertList, function (err, item) {
            if (err) console.error("err : " + err);

            var sqlForInsertList = "select * from buy as b JOIN ITEM as i on i.i_code = b.b_code where b.delivery != -1;";
            connection.query(sqlForInsertList, function (err, buy) {
                if (err) console.error("err : " + err);
                var sales = Array.from({length: 12}, () => 0);
                for(var i=0; i<buy.length; i++){
                    var date = new Date(buy[i].i_date);
                    sales[date.getMonth()]+=buy[i].b_count* buy[i].price;
                }
                res.render('manage', {user_id: id, admin: admin, rows: rows, item: item, sales:sales});
            });

        });
    });
});
router.post('/delivery/change', function (req, res) {
    var idx = req.body.idx;             //글 번호
    var delivery = req.body.delivery;
    var change = 0;
    if (delivery == 0) {
        change = 1;
    } else if (delivery == 1) {
        change = 2;
    } else if (delivery == 2) {
        change = 3;
    }
    var sqlForUpdateList = "UPDATE BUY SET delivery = ? WHERE idx = ?";
    connection.query(sqlForUpdateList, [change, idx], function (err, check_buy) {
        console.log(check_buy);
        var buy_success = check_buy.changedRows;
        if (err) console.error("err : " + err);
        if (buy_success == undefined || buy_success == null) {
            console.error("buy database setting is failed");
            res.send({data: "error"});
        } else {
            res.send({data: "success"});
        }
    });

});

module.exports = router;
