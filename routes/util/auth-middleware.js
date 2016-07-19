const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = function(req, res, next) {
  if (req.cookies.authorization) {
    jwt.verify(req.cookies.authorization, config.jwt.secret, function(err, decoded) {
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
          next();
        }
      }
    });
  } else {
    res
      .status(401)
      .json({
        code: 401.2,
        message: "not logged in"
      });
  }
};
