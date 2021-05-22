var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/',function (req, res,next){
    var sqlForSelectList = "SELECT u_id, pwd FROM user";
    connection.query(sqlForSelectList, function (err, rows){
        if (err) console.error("err : " + err);
        console.log("rows : "+ JSON.stringify(rows));

        res.render('main', {title: 'test', rows: rows});
    });
});
router.get('/login', function (req, res, next){
    res.render('login');
});
router.post('/login', function (req, res){

    var user_id = req.body.u_id;
    var passwd = req.body.pwd;

    var sqlForSelectList = "SELECT pwd FROM USER WHERE u_id=?";
    connection.query(sqlForSelectList,[user_id] ,function (err, result){
        if (err) console.error("err : " + err);
        console.log(result);
        console.log(passwd);
        if(result == 0)
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        else res.redirect('/');
    });
});

router.get('/sign', function (req, res, next){
    res.render('sign');
});
router.post('/sign', function (req, res){


    var sqlForInsertList = "INSERT INTO USER(u_id, pwd, u_name, addr, u_number, u_admin) values(?, ?, ?, ?, ?)";
    connection.query(sqlForInsertList,datas ,function (err, rows){
        if (err) console.error("err : " + err);
        console.log("rows : "+ JSON.stringify(rows));

        res.redirect('/test');
    });
});

module.exports = router;