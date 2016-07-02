module.exports = function(router) {
  router.get('/login', function(req, res, next) {
    res
      .status(200)
      .json({});
  });
};
