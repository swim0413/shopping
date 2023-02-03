let createError = require('http-errors');
const express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const expressSession = require('express-session');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let mainRouter = require('./routes/main');
let loginRouter = require('./routes/login');
let shopRouter = require('./routes/shop');

let adminRouter = require('./admin/admin');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended:true}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 세션세팅
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/main');
  } else {
    res.redirect('/login');
  }
});

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/main', mainRouter);
app.use('/login', loginRouter);
app.use('/shop', shopRouter);

app.use('/admin', adminRouter);


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
