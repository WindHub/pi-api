const Redis = require('redis');
const config = require('../../config');

module.exports = Redis.createClient(config.db.redis.url, {
  prefix: config.db.redis.prefix
});
