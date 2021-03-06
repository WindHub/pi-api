const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");

const config = require('../../config');

var router = express.Router();

function getAppInfo(appId, app) {
  return {
    id: appId,
    name: app.name,
    papi_url: app.papi_url,
    entrance_url: app.entrance_url,
    subject: app.subject,
    description: app.description
  };
}

router.get('/', function(req, res, next) {
  res
    .status(200)
    .json(_.map(config.apps, function(app, appId) {
      return getAppInfo(appId, app);
    }));
});

router.post('/:id',
  require('../util/auth-middleware'),
  require('../util/csrf-middleware'),
  function(req, res, next) {
    if(req.params.id) {
      if(req.params.id in config.apps) {
        var app = config.apps[req.params.id];
        var payload = {
          pi_user: {
            userId: req.auth.user.userId,
            grpId: req.auth.user.grpId,
            name: req.auth.user.name,
            email: req.auth.user.email
          },
          jti: req.auth.jti,
          exp: req.auth.exp
        };
        jwt.sign(payload, app.secret, {
          issuer: config.jwt.issuer,
          subject: app.subject
        }, function(err, token) {
          if(err) throw err;
          res
            .status(200)
            .json({
              token: token,
              app: getAppInfo(req.params.id, app)
            });
        });
      } else {
        res
          .status(400)
          .json({
            code: 400.2,
            message: "id invaild"
          });
      }
    } else {
      res
        .status(400)
        .json({
          code: 400.1,
          message: "id not found"
        });
    }
  }
);

module.exports = router;
