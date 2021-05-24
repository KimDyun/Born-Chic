const url = require('url');
var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


router.get('/',function (req, res,next){
     var id = req.cookies.id;
     if (id == null){
         res.cookie('id','');
         res.render('main',{title : 'Main', user_id: '', admin: ''});
     }
     if(id == ''){
         res.render('main',{title : 'Main', user_id: id, admin: ''});
     }
     else {
         var sqlForSelectList = "SELECT u_admin FROM USER WHERE u_id=?";
         connection.query(sqlForSelectList,[id] ,function (err, admin){
             if (err) console.error("err : " + err);
             res.clearCookie('admin');
             res.cookie('admin', admin[0].u_admin);
             res.render('main', {title : 'Main', user_id: id, admin: admin[0].u_admin});
         });
     }
});

router.post('/', function (req, res){
    var search = req.body.search;
    // res.redirect(url.format({
    //     pathname:'/itemlist/search/1/?search='+search
    // }));
    res.redirect('/itemlist/search/1/'+search);
});

router.get('/delete_cookie', function (req, res){
    res.clearCookie('id');
    res.clearCookie('admin');
    res.cookie('id', '');
    res.cookie('admin', '');
    res.redirect('/');
});


router.get('/login', function (req, res, next){
    res.render('login');
});

router.post('/login', function (req, res){

    var user_id = req.body.u_id;
    var passwd = req.body.pwd;
    var datas = [user_id, passwd]
    var sqlForSelectList = "SELECT * FROM USER WHERE u_id=? AND pwd=?";
    connection.query(sqlForSelectList,datas ,function (err, result){
        if (err) console.error("err : " + err);
        console.log(result);
        if(!result[0])
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        else {
            res.cookie('id', user_id);
            res.redirect('/');
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
    var sqlForCheckList = "SELECT * FROM USER WHERE u_id=?";
    connection.query(sqlForCheckList, user_id, function(err, rows){
        if (err) console.error("err : " + err);
        if(rows[0])
            res.send('<script type="text/javascript">alert("이미 존재하는 아이디입니다."); document.location.href="sign";</script>');
        else{
            var sqlForInsertList = "INSERT INTO USER(u_id, pwd, u_name, addr, u_number, u_admin) values(?, ?, ?, ?, ?, ?)";
            connection.query(sqlForInsertList,datas ,function (err, rows){
                if (err) console.error("err : " + err);
                console.log("rows : "+ JSON.stringify(rows));

                res.redirect('/login');
            });
        }
    });
});

module.exports = router;