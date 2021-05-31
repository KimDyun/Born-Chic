var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/:category/:cur_page/',function (req, res,next){
    var category = req.params.category;
    var cur_page = req.params.cur_page;
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var sqlForInsertList = "select idx, B.b_id, B.delivery, B.b_count, I.i_name, I.category, I.stock, I.sell, I.image, I.price from BUY as B JOIN ITEM as I on I.i_code = B.b_code where delivery=0 or delivery=1;";
    connection.query(sqlForInsertList, function (err, rows) {
        if (err) console.error("err : " + err);

        var page_list_size = 7;
        var total_count = 0;
        var sqlForSelectList = "select i_code, i_name, sell, price, image, category from item where sell>=1;";
        connection.query(sqlForSelectList, function (err, sellList) {
            if (err) console.error("err : " + err);

            var sqlForSelectList = "select ROUND(avg(rating)) as rate, c_code, i.* from comment as c JOIN ITEM as i on c.c_code = i.i_code group by c_code;";
            connection.query(sqlForSelectList, function (err, starList) {
                if (err) console.error("err : " + err);
                for(var i=0; i<sellList.length; i++){
                    sellList[i].rate = 0;
                    for(var j=0; j<starList.length; j++){
                        if(starList[j].i_code == sellList[i].i_code){
                            sellList[i].rate=starList[j].rate;
                            break;
                        }
                    }
                }

                var sqlForUpdateList = "SELECT count(*) as cnt FROM ITEM WHERE category = ?";
                connection.query(sqlForUpdateList, [category], function (err, number) {
                    if (err) console.error("err : " + err);
                    total_count = number[0].cnt;
                    if (total_count < 0) {
                        total_count = 0
                    }
                    var totalpage = Math.ceil(total_count / page_list_size);
                    var start = ((cur_page - 1) * page_list_size);
                    var end = (cur_page) * page_list_size - 1;

                    var sqlForInsertList = "select * from ITEM where category = ?";
                    connection.query(sqlForInsertList, [category], function (err, data) {
                        if (err) console.error("err : " + err);
                        var result = [];
                        var seq = 0;
                        for (var i = start; i <= end; i++) {
                            if (data[i] == null)
                                break;
                            result[seq] = data[i];
                            seq++;
                        }

                        var sqlForInsertList = "select * from buy as b JOIN ITEM as i on i.i_code = b.b_code where b.delivery != -1;";
                        connection.query(sqlForInsertList, function (err, buy) {
                            if (err) console.error("err : " + err);
                            var sales = Array.from({length: 12}, () => 0);
                            for (var i = 0; i < buy.length; i++) {
                                sales[buy[i].b_date.getMonth()] += buy[i].b_count * buy[i].price;
                            }
                            res.render('manage', {
                                user_id: id,
                                admin: admin,
                                rows: rows,
                                sellList: sellList,
                                total_page: totalpage,
                                cur_page: cur_page,
                                item: result,
                                category: category,
                                sales: sales
                            });
                        });
                    });
                });
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

router.post('/:category/:cur_page/', function (req, res){
    var search = req.body.search;
    res.redirect('/itemlist/search/1/'+search);
});

module.exports = router;
