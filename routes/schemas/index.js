const mongoose = require('mongoose');
const _ = require('lodash');
const config = require('../../config');

mongoose.connect(config.db.mongo);

module.exports = _.merge(
  require('./user')
);
