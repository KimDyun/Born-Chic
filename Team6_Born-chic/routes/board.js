var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));


const multer = require('multer');
const path = require('path');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'images/');
        },
        filename: function (req, file, cb) {
            var orig = file.originalname;
            var ext = path.extname(orig);
            cb(null, path.basename(orig,ext) + '_' + new Date().valueOf() + ext);
        }
    }),
});

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'tutorial',
    password: 'Eogus153@'
});

router.get('/',function (req, res,next){
    res.redirect('/board/list/1');
});

module.exports = router;