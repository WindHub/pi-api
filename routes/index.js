var express = require('express');
var router = express.Router();

var users = require('./users');
var apps = require('./apps');

router.use('/users', users);
router.use('/apps', apps);

module.exports = router;
