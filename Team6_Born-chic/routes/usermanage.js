var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


router.get('/',function (req, res,next){
    var id = req.cookies.id;
    var admin = req.cookies.admin;

    var sqlForSelectList = "SELECT * FROM user";
    connection.query(sqlForSelectList,function (err, data){
        if (err) console.error("err : " + err);
        res.render('usermanage', {user_id : id, admin: admin, rows: data});
    });
});

router.post('/', function (req, res){
    var search = req.body.search;
    res.redirect('/itemlist/search/1/'+search);
});

router.post('/sendmessage', function (req, res){
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var content = req.body.content;
    var user_id = req.body.user_id;

    var sqlForUpdateList = "insert into MESSAGE(adm_id,c_id,content,check_message) values(?,?,?,0)";
    connection.query(sqlForUpdateList, [id, user_id, content], function (err, check_buy) {
        if (err) console.error("err : " + err);
        if (check_buy == undefined || check_buy == null) {
            console.error("message database setting is failed");
            res.send({data: "error"});
        } else {
            res.send({data: "success"});
        }
    });
});

module.exports = router;
