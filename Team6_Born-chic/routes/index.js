var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/',function (req, res,next){
    var sqlForSelectList = "SELECT idx, creator_id, title, hit,content FROM board";
    connection.query(sqlForSelectList, function (err, rows){
      if (err) console.error("err : " + err);
      console.log("rows : "+ JSON.stringify(rows));

      res.render('index', {title: 'test', rows: rows});
    });
});
module.exports = router;