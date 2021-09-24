function auth(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/login#login');
  }

  return next();
}

export default auth;
