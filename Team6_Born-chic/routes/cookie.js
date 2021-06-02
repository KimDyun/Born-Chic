var express = require('express');
var router = express.Router();
var mysql_dbc = require('../config/database')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.get('/', function (req, res){
    res.clearCookie('id');
    res.clearCookie('admin');
    res.cookie('id', '');
    res.cookie('admin', '');
    res.redirect('/main');
});
module.exports = router;
