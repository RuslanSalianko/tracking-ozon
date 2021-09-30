import { Router } from 'express';
import Fid from '../model/fid.js';
import auth from '../middleware/auth.js';

export const router = Router();

router.get('/', auth, async (req, res) => {
  const fids = await Fid.find({ userId: req.user._id });

  res.render('difference', {
    title: 'Различия',
    isDifference: true,
    fids,
  });
});

router.post('/compare', auth, async (req, res) => {
  res.redirect('/difference');
});

export { router as differenceRouter };
