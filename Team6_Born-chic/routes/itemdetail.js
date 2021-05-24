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
    var item_code = req.params.i_code;
    var user_id = req.cookies.id;
    var buy_count = req.params.buy_count;

    var sqlForSelectList = "SELECT delivery FROM BUY WHERE b_id = ? and b_code = ?";
    connection.query(sqlForSelectList,[user_id, item_code],function (err, data){
        if (err) console.error("err : " + err);
        if(data.length!=0) {            //구매한 이력이 있는 경우
            if (data[0].delivery == -1) {       //장바구니에 담아져 있는 경우
                res.send({data: "already shopping cart"});
            }
            else{                       //구매 이력은 있지만 장바구니에는 담겨져 있지 않는 경우
                var sqlForSelectList = "INSERT INTO BUY(b_id, b_code, delivery, b_count) VALUES (?,?,?,?)";
                connection.query(sqlForSelectList,[user_id, item_code, -1, buy_count] ,function (err, data){
                    if (err) console.error("err : " + err);
                    if(data.length!=0)
                        res.send({data: "success"});
                    else
                        res.send({data:"error"});
                });
            }
        }
        else{                           //구매한 이력이 없는 경우
            var sqlForSelectList = "INSERT INTO BUY(b_id, b_code, delivery, b_count) VALUES (?,?,?,?)";
            connection.query(sqlForSelectList,[user_id, item_code, -1, buy_count] ,function (err, data){
                if (err) console.error("err : " + err);
                if(data!=null)
                    res.send({data: "success"});
                else
                    res.send({data:"error"});
            });
        }
    });
});

router.get('/shopping/buy/:buy_count/:i_code',function (req, res,next){
    var item_code = req.params.i_code;
    var user_id = req.cookies.id;
    var buy_count = req.params.buy_count;

    var sqlForSelectList = "SELECT delivery FROM BUY WHERE b_id = ? and b_code = ?";
    connection.query(sqlForSelectList,[user_id, item_code],function (err, data){
        if (err) console.error("err : " + err);
        if(data!=null) {            //구매한 이력이 있는 경우
            if (data[0].delivery == -1) {       //장바구니에 담아져 있는 경우

                //여기에 코드짜야됨

                res.send({data: "already shopping cart"});
            }
        }
        else{                           //구매한 이력이 없는 경우

        }
    });
});
module.exports = router;
