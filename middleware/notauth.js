module.exports = function(req, res, next){
  if(req.session.isAuthenticated){
    return res.redirect(`${process.env.BASE_URL}/admin/panel`);
  }
  return next();
};