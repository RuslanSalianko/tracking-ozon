import { Router } from 'express';
import Fid from '../model/fid.js';
import Ozon from '../utils/ozon.js';
import auth from '../middleware/auth.js';

export const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const fids = await Fid.find({ useId: req.user._id });

    return res.render('fids', {
      title: 'Fids',
      isFids: true,
      fids,
    });
  } catch (error) {
    return new Error(error);
  }
});

router.post('/getDataOzon', auth, async (req, res) => {
  try {
    const ozon = new Ozon(req.session.user.clientId, req.session.user.apiKey);
    const ozonFid = await ozon.getFid();
    const fid = new Fid({
      userId: req.user._id,
      fid: ozonFid,
    });
    await fid.save();
    return res.status(200).redirect('/fids');
  } catch (error) {
    return new Error(error);
  }
});

export { router as fidsRouter };
