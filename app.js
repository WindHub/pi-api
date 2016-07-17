var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if(config.isCORSEnabled) app.use(require('./routes/util/cors-middleware'));

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res
      .status(err.status || 500)
      .json({
        message: err.message,
        error: err
      });
  });
}

app.use(function(err, req, res, next) {
  res
    .status(err.status || 500)
    .json({
      message: err.message,
      error: {}
    });
});


module.exports = app;
