var config = require('../../config');

module.exports = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", config.url);
  res.header("Access-Control-Allow-Headers", "Accept, Accept-Encoding, Accept-Language, Cache-Control, Cookie, User-Agent, Content-Type, Origin, Host, Referer, X-CSRF-Token, X-Requested-With");
  res.header("Access-Control-Max-Age", config.CORSMaxAge);
  res.header("Access-Control-Max-Methods", "POST, GET, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};
