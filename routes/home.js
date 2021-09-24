import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    isHome: true
  });
});

export {router as homeRouter};
