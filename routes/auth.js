import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../model/user.js';
import { registerValidators, loginValidators } from '../utils/validators.js';

const router = Router();

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: "Sing Up",
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  });
});

router.post('/login', loginValidators, async (req, res) => {
  try {
    const { email } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      req.flash('loginError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#login');
    }

    const candidate = await User.findOne({ email })

    req.session.user = candidate;
    req.session.isAuthenticated = true;
    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, password, lastName, firstName } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      req.flash('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }
    const hashPassword = await bcryptjs.hash(password, 12);
    const user = new User({
      email, password: hashPassword, lastName, firstName
    });

    await user.save();
    res.redirect('/auth/login#login');
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', async (req, res) => {
  req.session.isAuthenticated = false;
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

export {router as authRouter};
