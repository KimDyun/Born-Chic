var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res, next) {
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var sqlForInsertList = "select i_code, i.image, i_name, i.price, b_date, b.delivery, b_count from item as i, buy as b where i_code = b_code and b.delivery <=2 and b_id = ?";
    connection.query(sqlForInsertList, [id], function (err, rows) {
        if (err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));
        var sqlForInsertList = "select * from user where u_id = ?";
        connection.query(sqlForInsertList, [id], function (err, user) {
            if (err) console.error("err : " + err);
            res.render('mypage', {user_id: id, admin: admin, rows: rows, user:user});
        });
    });
});
router.post('/', function (req, res){
    var search = req.body.search;
    res.redirect('/itemlist/search/1/'+search);
});
router.post('/control', function (req, res) {
    var id = req.cookies.id;
    var item_code = req.body.i_code;
    var buy_code = req.body.b_code;
    var buy_count = req.body.b_count;
    var item_codes = req.body.i_codes;
    var buy_codes = req.body.b_codes;
    var buy_counts = req.body.b_counts;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var date_form = year + '-' + month + '-' + day;

    // 장바구니에서 상품 제거 시
    if (item_code != undefined && buy_count == undefined && buy_code == undefined && item_codes == undefined && buy_codes == undefined && buy_counts == undefined) {
        var sqlForDeleteList = "DELETE From buy WHERE b_id = ? and b_code = ? and delivery = -1";
        connection.query(sqlForDeleteList, [id, item_code], function (err, check) {
            var purchase_success = check.changedRows;
            if (err) console.error("err : " + err);
            if (purchase_success == undefined) {
                res.send({data: "delete error"});
            } else {
                res.send({data: "delete success"});
            }
        });
    }
    // 장바구니에서 상품 구매 시
    if (item_code != undefined && buy_count != undefined && buy_code == undefined && item_codes == undefined && buy_codes == undefined && buy_counts == undefined) {
        var sqlForUpdateList = "UPDATE item SET sell = sell+?, stock = stock-? WHERE i_code = ?";
        connection.query(sqlForUpdateList, [buy_count, buy_count, item_code], function (err, check_item) {
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
    // 배송 목록에서 배송 완료 상품 삭제 시
    if (buy_code != undefined && item_code == undefined && buy_count == undefined && item_codes == undefined && buy_codes == undefined && buy_counts == undefined) {
        var sqlForUpdateList = "UPDATE buy SET delivery = 3 WHERE b_code = ?";
        connection.query(sqlForUpdateList, [buy_code], function (err, check) {
            var purchase_success = check.changedRows;
            if (err) console.error("err : " + err);
            if (purchase_success == undefined) {
                res.send({data: "delete error"});
            } else {
                res.send({data: "delete success"});
            }
        });
    }
    // 장바구니에서 전체 상품 제거 시
    if (item_codes !== undefined && item_code == undefined && buy_count == undefined && buy_code == undefined && buy_codes == undefined && buy_counts == undefined) {
        var count = 0;
        for(var i = 0 ; i<item_codes.length ; i++) {
            var sqlForDeleteList = "DELETE From buy WHERE b_id = ? and b_code = ? and delivery = -1";
            connection.query(sqlForDeleteList, [id, item_codes[i]], function (err, check) {
                if(count == item_codes.length - 1) {
                    if (err) console.error("err : " + err);
                    var delete_success = check.changedRows;
                    if (delete_success == undefined) {
                        res.send({data: "delete error"});
                    } else {
                        res.send({data: "delete success"});
                    }
                }
                count++;
            });
        }
    }
    // 장바구니에서 전체 상품 구매 시
    if (item_codes != undefined && buy_counts != undefined && buy_code == undefined && item_code == undefined && buy_codes == undefined && buy_count == undefined) {
        for(var i = 0 ; i<item_codes.length ; i++) {
            var sqlForUpdateList = "UPDATE item SET sell = sell+?, stock = stock-? WHERE i_code = ?";
            connection.query(sqlForUpdateList, [buy_counts[i], buy_counts[i], item_codes[i]], function (err, check_item) {});
        }

        var count = 0;
        for(var i = 0 ; i<item_codes.length ; i++) {
            sqlForUpdateList = "UPDATE buy SET delivery = 0, b_date = ? WHERE b_id = ? and b_code = ? and delivery = -1";
            connection.query(sqlForUpdateList, [date_form, id, item_codes[i]], function (err, check) {
                if(count == item_codes.length - 1) {
                    var purchase_success = check.changedRows;
                    if (err) console.error("err : " + err);
                    if (purchase_success == undefined) {
                        res.send({data: "Purchase error"});
                    } else {
                        res.send({data: "Purchase success"});
                    }
                }
                count++;
            });
        }

    }
    // 배송목록에서 전체 상품 제거 시
    if (buy_codes !== undefined && item_code == undefined && buy_count == undefined && buy_code == undefined && item_codes == undefined && buy_counts == undefined) {
        var count = 0;
        for(var i = 0 ; i<buy_codes.length ; i++) {
            var sqlForUpdateList = "UPDATE buy SET delivery = 3 WHERE b_code = ?";
            connection.query(sqlForUpdateList, [buy_codes[i]], function (err, check) {
                if(count == buy_codes.length-1) {
                    var purchase_success = check.changedRows;
                    if (err) console.error("err : " + err);
                    if (purchase_success == undefined) {
                        res.send({data: "delete error"});
                    } else {
                        res.send({data: "delete success"});
                    }
                }
                count++;
            });
        }
    }
});
router.post('/check/pwd', function (req, res, next) {
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var pwd = req.body.pwd;
    var sqlForInsertList = "select * from user where pwd = ? and u_id = ?";
    connection.query(sqlForInsertList, [pwd,id], function (err, rows) {
        if (err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));
        if(rows.length!=0) {
            res.send({data: "check success"});
        }
        else{
            res.send({data: "check failed"});
        }
    });
});

router.post('/change/pwd', function (req, res, next) {
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var pwd = req.body.pwd;
    var sqlForInsertList = "update user set pwd = ? where u_id = ?";
    connection.query(sqlForInsertList, [pwd,id], function (err, rows) {
        if (err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));
        if(rows.changedRows==1) {
            res.send({data: "change success"});
        }
        else{
            res.send({data: "change failed"});
        }
    });
});
module.exports = router;
