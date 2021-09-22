import { Router } from 'express';
import { validationResult } from 'express-validator';
import User from '../model/user.js';
import { default as auth } from '../middleware/auth.js';
import { settingsValidators } from '../utils/validators.js';

export const router = Router();

router.get('/', auth, (req, res) => {
  res.render('settings', {
    title: 'Настройки',
    isSettings: true,
    client_id: req.session.user.client_id,
    api_key: req.session.user.api_key,
    settingsError: req.flash('settingsError')
  });
});

router.post('/', auth, settingsValidators, async (req, res) => {
  const {client_id, api_key} = req.body;
  const error = validationResult(req);
  if(!error.isEmpty()){
    req.flash('settingsError',error.array()[0].msg);
    return res.status(422).redirect('/settings');
  }

  const user = await User.findById(req.user._id);

  user.client_id = client_id;
  user.api_key = api_key;
  await user.save();

  res.redirect('/settings');
});
