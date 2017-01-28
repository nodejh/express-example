const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const session = require('express-session');
const config = require('./config/config');
const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();
const dbOptions = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  port: config.db.port,
  database: config.db.database,
};

/**
 * 使用内存保存 session
 * @type {Object}
 */
const sessionOption = {
  secret: 'abcdefg',
  // cookie: { maxAge: 60000 },
  name: 'express.sid',
  resave: false,
  saveUninitialized: true,
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(myConnection(mysql, dbOptions, 'single'));
app.use(session(sessionOption));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
