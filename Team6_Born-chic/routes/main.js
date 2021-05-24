var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/',function (req, res,next){
    res.render('main');
});

router.post('/', function (req, res){

    var search = req.body.search;
    console.log(search);
    res.redirect('/');
});


router.get('/l_main',function (req, res,next){
    var id = req.cookies.id;
    console.log(id);

    var sqlForSelectList = "SELECT u_admin FROM USER WHERE u_id=?";
    connection.query(sqlForSelectList,[id] ,function (err, admin){
        if (err) console.error("err : " + err);
        res.render('l_main', {title : 'Main', user_id: id, admin: admin});
    });
});

router.post('/l_main:id', function (req, res){

    var search = req.body.search;
    console.log(search);
    res.redirect('/l_main');
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
        else {
            res.cookie('id', user_id);
            res.redirect('/l_main');
        }
    });
});

router.get('/sign', function (req, res, next){
    res.render('sign');
});
router.post('/sign', function (req, res){

    var user_id = req.body.u_id;
    var passwd = req.body.pwd;
    var u_name = req.body.u_name;
    var addr = "노원구";
    var u_number = req.body.u_number;
    var u_admin = false;
    var datas = [user_id, passwd, u_name, addr, u_number, u_admin];
    var sqlForInsertList = "INSERT INTO USER(u_id, pwd, u_name, addr, u_number, u_admin) values(?, ?, ?, ?, ?, ?)";
    connection.query(sqlForInsertList,datas ,function (err, rows){
        if (err) console.error("err : " + err);
        console.log("rows : "+ JSON.stringify(rows));

        res.redirect('/login');
    });
});

module.exports = router;
