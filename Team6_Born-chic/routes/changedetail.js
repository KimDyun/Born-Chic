var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res){
    var id = req.cookies.id;
    var admin = req.cookies.admin;
    var sqlForSelectList = "SELECT * FROM USER WHERE u_id=?";
    connection.query(sqlForSelectList,[id], function (err, result){
        if (err) console.error("err : " + err);
        console.log(result);
        var addr = [];
        addr=result[0].addr.split('+');
        res.render('changedetail', {user_id: id, rows:result,admin:admin, addr:addr});
    });
});
router.post('/change/detail_info', function (req, res) {
    var id = req.cookies.id;
    var name = req.body.name;
    var addr = req.body.addr;
    var phone = req.body.phone;

    var sqlForUpdateList = "UPDATE user SET u_name = ?, addr = ?, u_number = ? WHERE u_id = ?";
    connection.query(sqlForUpdateList, [name, addr, phone, id], function (err, check_buy) {
        console.log(check_buy);
        if (err) console.error("err : " + err);
        if (check_buy == undefined || check_buy == null) {
            console.error("buy database setting is failed");
            res.send({data: "error"});
        } else {
            res.send({data: "success"});
        }
    });

});
module.exports = router;
