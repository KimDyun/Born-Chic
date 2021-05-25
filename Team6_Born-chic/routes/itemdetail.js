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

        var sqlForSelectList = "SELECT * FROM COMMENT WHERE c_code=? ORDER BY p_id, reply, idx";
        connection.query(sqlForSelectList,[i_code] ,function (err, reply){
            if (err) console.error("err : " + err);
            res.render('itemdetail', {user_id : id, admin: admin, rows: data, date:date, reply:reply});
        });
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

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var date_form = year + '-' + month + '-' + day;


    var sqlForUpdateList = "UPDATE item SET sell = sell+?, stock = stock-? WHERE i_code = ?";
    connection.query(sqlForUpdateList, [buy_count, buy_count, item_code], function (err, check_item) {
        console.log(check_item);
        if (err) console.error("err : " + err);

        sqlForUpdateList = "INSERT INTO buy(b_id, b_code, delivery, b_count, b_date) values (?,?,?,?,?)";
        connection.query(sqlForUpdateList, [user_id, item_code, 0, buy_count, date_form], function (err, check) {
            if (err){
                console.error("err : " + err);
                res.send({data: "error"});
            } else {
                res.send({data: "success"});
            }
        });
    });

});

router.post('/reply/write', function (req, res){
    var idx = req.body.idx;             //글 번호
    var reply_content = req.body.reply_content;
    var reply_id = req.body.reply_id;
    var id = req.cookies.id;
    var admin = req.cookies.admin;


    if(reply_id=="" || reply_id ==null){                                   //댓글작성
        var sqlForUpdateList = "select count(*) as cnt from COMMENT";
        connection.query(sqlForUpdateList, function (err, check_reply){
            if(check_reply[0].cnt==0){
                var sqlForUpdateList = "insert into COMMENT(c_id, c_code, content, reply, p_id) values (?, ?, ?, ?, ?)";
                connection.query(sqlForUpdateList, [id, idx, reply_content, 0, 1],function (err, check_reply){
                    if (err) {
                        console.error("err : " + err);
                        res.send({data:"error"});
                    }
                    else{
                        res.send({data:"success"});
                    }
                });
            }
            else{
                var sqlForUpdateList = "insert into COMMENT(c_id, c_code, content, reply, p_id) values (?, ?, ?, ?, (select t from (select max(idx) as t from COMMENT) as max_idx)+1)";
                connection.query(sqlForUpdateList, [id, idx, reply_content, 0],function (err, check_reply){
                    if (err) {
                        console.error("err : " + err);
                        res.send({data:"error"});
                    }
                    else{
                        res.send({data:"success"});
                    }
                });
            }
        });
    }
    else{                                                                   //답글작성
        var sqlForUpdateList = "insert into COMMENT(c_id, c_code, content, reply, p_id) values (?, ?, ?, ?, ?)";
        connection.query(sqlForUpdateList, [id, idx, reply_content, 1, reply_id],function (err, check_reply){
            if (err) {
                console.error("err : " + err);
                res.send({data:"error"});
            }
            else{
                res.send({data:"success"});
            }
        });
    }
});
module.exports = router;
