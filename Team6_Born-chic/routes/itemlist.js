var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/:category/:cur_page',function (req, res,next){
    var category = req.params.category;
    var cur_page = req.params.cur_page;
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var page_list_size = 12;
    var total_count = 0;
    console.log(admin);
    console.log(id);
    var sqlForSelectList = "SELECT count(*) as cnt FROM ITEM WHERE category = ?";
    connection.query(sqlForSelectList,[category], function (err, rows){
        if (err) console.error("err : " + err);
        total_count = rows[0].cnt;
        if (total_count < 0) {
            total_count = 0
        }
        var totalpage = Math.ceil(total_count/page_list_size);
        var start = ((cur_page-1)*page_list_size);
        var end = (cur_page)*page_list_size-1;

        var sqlForSelectList = "SELECT * FROM ITEM WHERE category = ?";
        connection.query(sqlForSelectList,[category], function (err, data){
            if (err) console.error("err : " + err);
            var result = [];
            var seq=0;
            for(var i= start; i<=end; i++){
                if(data[i]==null)
                    break;
                result[seq] = data[i];
                seq++;
            }
            res.render('itemlist', {user_id : id, admin: admin, rows: result,total_page:totalpage, cur_page:cur_page, category:category});
        });
    });

});
module.exports = router;