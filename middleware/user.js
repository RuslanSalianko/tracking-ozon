import User from '../model/user.js';

async function userMiddleware(req, res, next) {
  if (!(req.session.user)) {
    return next();
  }
  req.user = await User.findById(req.session.user._id);
  return next();
}

export default userMiddleware;
