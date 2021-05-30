var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


router.get('/itemupdate/:i_code', function (req, res, next){
    var item_code = req.params.i_code;
    console.log(item_code);
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    if(item_code != undefined) {
        var sqlForSelectList = "SELECT i_code, i_name, category, image, stock, price, detail FROM item WHERE i_code = ?";
        connection.query(sqlForSelectList, [item_code], function (err, row) {
            if (err) console.error("err : " + err);
            console.log("row : " + JSON.stringify(row));
            res.render('itemupdate', {user_id: id, admin: admin, row: row[0]});
        });
    }
});

router.post('/itemupdate/:i_code',function(req,res,next){
    var item_code = req.params.i_code;
    var item_category = req.body.i_category;
    var item_name = req.body.i_name;
    var item_stock = req.body.i_stock;
    var item_price = req.body.i_price;
    var item_image = req.body.i_image;
    var item_detail = req.body.i_content;

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var date_form = year + '-' + month + '-' + day;
    if(item_category !=undefined) {
        var data = [item_name, item_category, item_stock, 0, item_image, item_detail, item_price, date_form, item_code];
        console.log(data);
        var sqlForUpdateList = "UPDATE item SET i_name =?, category =?, stock =?, sell =?, image =?, detail =?, price =?, i_date=? WHERE i_code = ?";
        connection.query(sqlForUpdateList, data, function (err, check) {
            console.log(check);
            var purchase_success = check.changedRows;
            if (err) console.error("err : " + err);
            if (purchase_success == undefined) {
                res.send({data: "upload error"});
            } else {
                res.send({data: "upload success"});
            }
        });
    }
    else{
        var sqlForDeleteList = "DELETE FROM item WHERE i_code = ?";
        connection.query(sqlForDeleteList, item_code, function(err,check){
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

router.get('/itemupload', function (req, res, next){
    var id = req.cookies.id;
    var admin = req.cookies.admin;

    res.render('itemupload', {user_id: id, admin: admin});
});

router.post('/itemupload',function(req,res,next){
    var item_category = req.body.i_category;
    var item_name = req.body.i_name;
    var item_stock = req.body.i_stock;
    var item_price = req.body.i_price;
    var item_image = req.body.i_image;
    var item_detail = req.body.i_content;

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var date_form = year + '-' + month + '-' + day;

    var data = [item_name,item_category,item_stock,0,item_image,item_detail,item_price,date_form];
    console.log(data);
    var sqlForINSERTList = "INSERT INTO item(i_name, category, stock, sell, image, detail, price, i_date) VALUES(?,?,?,?,?,?,?,?)";
    connection.query(sqlForINSERTList, data, function (err, check) {
        console.log(check);
        var purchase_success = check.changedRows;
        if (err) console.error("err : " + err);
        if (purchase_success == undefined) {
            res.send({data: "upload error"});
        } else {
            res.send({data: "upload success"});
        }
    });
});

router.post('/search', function (req, res){
    var search = req.body.search;
    res.redirect('/itemlist/search/1/'+search);
});
module.exports = router;
