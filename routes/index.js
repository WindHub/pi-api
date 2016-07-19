const express = require('express');
const router = express.Router();

const users = require('./users');
const apps = require('./apps');

router.use('/users', users);
router.use('/apps', apps);

module.exports = router;
