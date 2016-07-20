const jwt = require('jsonwebtoken');
const Step = require('step');

const config = require('../../config');
const redis = require('../services').Redis;

module.exports = function(req, res, next) {
  Step(
    function() {
      if (req.cookies.authorization) {
        jwt.verify(req.cookies.authorization, config.jwt.secret, this);
      } else {
        res
          .status(401)
          .json({
            code: 401.2,
            message: "not logged in"
          });
      }
    },
    function(err, decoded) {
      if (err) {
        if (err.name == "TokenExpiredError") {
          res
            .status(401)
            .json({
              code: 401.5,
              message: "token expired"
            });
        } else {
          res
            .status(401)
            .json({
              code: 401.3,
              message: "invaild authorization token"
            });
        }
      } else {
        if (decoded.sub != config.jwt.subject || decoded.iss != config.jwt.issuer) {
          res
            .status(401)
            .json({
              code: 401.4,
              message: "invaild authorization payload"
            });
        } else {
          req.auth = decoded;
          redis.get('auth:' + decoded.jti, this);
        }
      }
    },
    function(err, result) {
      if (err) throw err;
      if (result !== null) {
        next();
      } else {
        res
          .status(401)
          .json({
            code: 401.7,
            message: "parent token expired"
          });
      }
    }
  );
};
