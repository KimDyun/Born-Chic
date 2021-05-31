const url = require('url');
var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/',function (req, res,next){
     var id = req.cookies.id;
    if(id==null)
        id ="";
    var sqlForSelectList2 = "select * from ITEM ORDER BY i_date DESC limit 3";
    connection.query(sqlForSelectList2 ,function (err, new_item) {
        if (err) console.error("err : " + err);

        var sqlForSelectList3 = "select ROUND(avg(rating)) as rate, c_code, i.* from comment as c JOIN ITEM as i on c.c_code = i.i_code group by c_code order by rate desc limit 3";
        connection.query(sqlForSelectList3, function (err, popular_item) {

            var message=[];
            if (err) console.error("err : " + err);
            if (id == null) {
                res.cookie('id', '');
                res.render('main', {title: 'Main', user_id: '', admin: '', new_item: new_item, popular_item:popular_item, message:message});
            }
            if (id == '') {
                res.render('main', {title: 'Main', user_id: id, admin: '', new_item: new_item, popular_item:popular_item, message:message});
            } else {
                var sqlForSelectList3 = "select * from MESSAGE where c_id = ? and check_message=0";
                connection.query(sqlForSelectList3,[id], function (err, message) {
                    var sqlForSelectList = "SELECT u_admin FROM USER WHERE u_id=?";
                    connection.query(sqlForSelectList, [id], function (err, admin) {
                        if (err) console.error("err : " + err);
                        res.cookie('admin', admin[0].u_admin);
                        res.render('main', {
                            title: 'Main',
                            user_id: id,
                            admin: admin[0].u_admin,
                            new_item: new_item,
                            popular_item: popular_item,
                            message: message
                        });
                    });
                });
            }
        });
    });
});

router.post('/', function (req, res){
    var search = req.body.search;
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
            res.redirect('/main');
        }
    });
});

router.get('/sign', function (req, res, next){
    res.render('sign');
});

router.post('/sign', function(req, res){
    var user_id = req.body.u_id;
    var passwd = req.body.pwd;
    var u_name = req.body.u_name;
    var addr = req.body.u_addr;
    var addr2 = req.body.u_addr2;
    var u_number = req.body.u_number;
    var u_admin = false;
    addr += '+';
    addr += addr2;
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
                res.redirect('/main/login');
            });
        }
    });
});
router.post('/message/update', function (req, res, next){
    var idx = req.body.idx;
    var sqlForUpdateList = "UPDATE MESSAGE SET check_message = 1 WHERE idx = ?";
    connection.query(sqlForUpdateList, [idx], function (err, check) {
        if (err) console.error("err : " + err);
        if (check == undefined) {
            res.send({data: "error"});
        } else {
            res.send({data: "success"});
        }
    });
});
module.exports = router;
