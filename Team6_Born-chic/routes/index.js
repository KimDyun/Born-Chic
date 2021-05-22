var express = require('express');
var router = express.Router();

router.get('/',function (req, res,next){
    var sqlForSelectList = "SELECT u_id, pwd FROM user";
    connection.query(sqlForSelectList, function (err, rows){
      if (err) console.error("err : " + err);
      console.log("rows : "+ JSON.stringify(rows));

      res.render('index', {title: 'test', rows: rows});
    });
});
module.exports = router;
