import { Router } from 'express';
import { validationResult } from 'express-validator';
import User from '../model/user.js';
import auth from '../middleware/auth.js';
import { settingsValidators } from '../utils/validators.js';

export const router = Router();

router.get('/', auth, (req, res) => {
  res.render('settings', {
    title: 'Настройки',
    isSettings: true,
    clientId: req.session.user.clientId,
    apiKey: req.session.user.apiKey,
    settingsError: req.flash('settingsError'),
  });
});

router.post('/', auth, settingsValidators, async (req, res) => {
  const { clientId, apiKey } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    req.flash('settingsError', error.array()[0].msg);
    return res.status(422).redirect('/settings');
  }

  const user = await User.findById(req.user._id);

  user.clientId = clientId;
  user.apiKey = apiKey;
  await user.save();

  return res.redirect('/settings');
});

export { router as settingsRouter };
