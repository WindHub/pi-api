var express = require('express');
var router = express.Router();

var login = require('./login')(router);

router.get('/', function(req, res, next) {
  res
    .status(200)
    .json({});
});

module.exports = router;
