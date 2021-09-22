import { Router } from "express";

export const router = Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    isHome: true
  });
});

