var express = require('express');
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
var ms = require('ms');

var config = require('../../config');

var router = express.Router();

router.get('/', function(req, res, next) {
  res
    .status(200)
    .json({});
});

router.post('/login', function(req, res, next) {
  if(req.body.username == 'SkyZH' && req.body.password == '123456') {
    var exp = config.jwt.expires;
    var payload = {
      user: {
        userId: 1,
        grpId: 1,
        name: "SkyZH"
      }
    };
    jwt.sign(payload, config.jwt.secret, {
      expiresIn: Math.floor(exp / 1000),
      issuer: config.jwt.issuer,
      jwtid: randomstring.generate(16),
      subject: config.jwt.subject
    }, function(err, token) {
      if(err) throw err;
      res
        .status(200)
        .cookie('authorization', token, {
          httpOnly: true,
          domain: config.api_url,
          maxAge: config.jwt.expires,
          path: '/',
          secure: config.secure
        });
      if(req.body.remember) {
        res.cookie('remembertoken', "placeholder", {
          httpOnly: true,
          domain: config.api_url,
          maxAge: ms('14 days'),
          path: '/',
          secure: config.secure
        });
      }
      res.json({});
    });
  } else {
    res
      .status(401)
      .json({
        code: 401.1,
        message: "wrong username or password"
      });
  }
});


router.post('/me', require('../util/auth-middleware'), function(req, res, next) {
  res
    .status(200)
    .json({
      user: req.auth.user,
      exp: req.auth.exp,
      iat: req.auth.iat,
      iss: req.auth.iss,
      sub: req.auth.sub
    });
});

router.post('/logout', require('../util/auth-middleware'), function(req, res, next) {
  res
    .status(200)
    .clearCookie('authorization', {
      domain: config.api_url,
      path: '/',
      secure: config.secure
    })
    .clearCookie('remembertoken', {
      domain: config.api_url,
      path: '/',
      secure: config.secure
    })
    .json({});
});

module.exports = router;
