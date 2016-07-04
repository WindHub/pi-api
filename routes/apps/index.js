var express = require('express');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");

var config = require('../../config');
var router = express.Router();

function getAppInfo(appId, app) {
  return {
    id: appId,
    name: app.name,
    api_url: app.api_url,
    app_entrance_url: app.app_entrance_url,
    subject: app.subject
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
            userId: 1,
            grpId: 1,
            name: "SkyZH"
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
