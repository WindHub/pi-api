const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('./config');

const routes = require('./routes/index');

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
