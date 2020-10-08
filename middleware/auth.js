module.exports = function (req, res, next) {
  if (!req.session.isAuthenticated){
    return res.redirect('/admin/login-to-admin');
  }
  return next();
};