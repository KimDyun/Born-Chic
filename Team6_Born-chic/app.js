var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main');
var mypageRouter = require('./routes/mypage');
var itemlistRouter = require('./routes/itemlist');
var itemdetailRouter = require('./routes/itemdetail');
var managedetailRouter = require('./routes/managedetail');
var manageRouter = require('./routes/manage');
var changedetailRouter = require('./routes/changedetail');
var usermanageRouter = require('./routes/usermanage');

var cookieRouter = require('./routes/cookie');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));               //경로 /img/?.png 이런식으로 할 수 있도록 선언한 것


app.set('view engine', 'ejs');
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', cookieRouter);
app.use('/main', mainRouter);
app.use('/users', usersRouter);
app.use('/index', indexRouter);
app.use('/mypage', mypageRouter);
app.use('/itemlist', itemlistRouter);
app.use('/itemdetail', itemdetailRouter);
app.use('/managedetail', managedetailRouter);
app.use('/manage', manageRouter);
app.use('/changedetail',changedetailRouter);
app.use('/usermanage',usermanageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
