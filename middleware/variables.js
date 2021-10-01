function varMiddleware(req, res, next) {
  res.locals.isAuth = req.session.isAuthenticated;
  res.locals.csrf = req.csrfToken();
  next();
}

export default varMiddleware;
