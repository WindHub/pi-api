const assert = require('assert');
const express = require('express');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");
const ms = require('ms');
const Step = require('step');
const bcrypt = require('bcrypt');

const config = require('../../config');
const User = require('../schemas').User;
const UserValidation = require('../const').Validation.User;

var router = express.Router();

router.get('/', function(req, res, next) {
  res
    .status(200)
    .json({});
});

router.post('/', function(req, res, next) {
  Step(
    function() {
      assert(req.body.name, { message: "name required", code: 400.2 });
      assert(UserValidation.Username.test(req.body.name), { message: "name invaild", code: 400.3 });
      assert(req.body.password, { message: "password required", code: 400.4 });
      assert(UserValidation.Password.test(req.body.password), { message: "password invaild", code: 400.5 });
      assert(req.body.email, { message: "email required", code: 400.6 });
      assert(UserValidation.Email.test(req.body.email), { message: "email invaild", code: 400.7 });
      //TODO: CAPTCHA and License Agreement
      this();
    },
    function(err) {
      if (err) throw err;
      bcrypt.hash(req.body.password, config.password.saltRounds, this);
    },
    function(err, hash) {
      if (err) throw err;
      var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        grpId: 1
      });
      user.save(this);
    },
    function(err, user) {
      if (err) throw err;
      res
        .status(200)
        .json({
          id: user.id,
          name: user.name,
          email: user.email,
          grpId: user.grpId
        });
    },
    function(err) {
      if (err) {
        if (err.name == 'MongoError' && err.code == 11000) {
          res
            .status(400)
            .json({ code: 400.8, message: "duplicate username or email" });
        } else {
          res
            .status(400)
            .json({ code: err.message.code || 400.1, message: err.message.message || "" });
        }
      }
    }
  );
});

router.post('/login', function(req, res, next) {
  var __user;
  Step(
    function() {
      User.findOne({ $or:[{ 'name': req.body.username }, { 'email': req.body.username }]}, this);
    },
    function(err, user) {
      if (err) throw err;
      __user = user;
      bcrypt.compare(req.body.password, user.password, this);
    },
    function(err, result) {
      if (err) throw err;
      if (result) {
        var exp = config.jwt.expires;
        var payload = {
          user: {
            userId: __user.id,
            grpId: __user.grpId,
            name: __user.name,
            email: __user.email
          }
        };
        jwt.sign(payload, config.jwt.secret, {
          expiresIn: Math.floor(exp / 1000),
          issuer: config.jwt.issuer,
          jwtid: randomstring.generate(16),
          subject: config.jwt.subject
        }, this);
      } else {
        res
          .status(401)
          .json({
            code: 401.1,
            message: "wrong username or password"
          });
      }
    },
    function(err, token) {
      if (err) throw err;
      res
        .status(200)
        .cookie('authorization', token, {
          httpOnly: true,
          domain: config.api_url,
          maxAge: config.jwt.expires,
          path: '/',
          secure: config.secure
        });
      if (req.body.remember) {
        res.cookie('remembertoken', "placeholder", {
          httpOnly: true,
          domain: config.api_url,
          maxAge: ms('14 days'),
          path: '/',
          secure: config.secure
        });
      }
      res.json({});
    },
    function(err) {
      console.error(err);
      res
        .status(500)
        .json();
    }
  );
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
