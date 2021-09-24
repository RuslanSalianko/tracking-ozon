import { body } from "express-validator";
import bcryptjs from 'bcryptjs';
import User from "../model/user.js";

const registerValidators = [
  body('lastName')
    .isLength({ min: 3 })
    .withMessage('Длина имени должна быть больше 3 символов')
    .trim(),
  body('firstName')
    .isLength({ min: 3 })
    .withMessage('Длина фамилии должна быть больше 3 символов')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('Пользователь с таким email существует');
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body('password', 'Пароль должен состоять минимум из 6 символов')
    .isLength({ min: 6, max: 255 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject('Пароли не совпадают');
      }
      return true;
    })
    .trim()
];

const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Введите email')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject('Ведено не правильное имя или пароль');
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body('password')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: req.body.email });
        const isPassword = await bcryptjs.compare(value, user.password);

        if (!isPassword) {
          return Promise.reject('Ведено не правильное имя или пароль!');
        }
      } catch (error) {
        console.log(error);
      }
    })
];

const settingsValidators = [
  body('clientId', 'Client id должен состоять из 5 цифр')
    .isLength({ min: 5, max: 5 })
    .withMessage('Длина должна быть 5 символов')
    .isNumeric()
    .trim(),
  body('apiKey', 'API key должен быть формата xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
    .isLength({min: 36, max: 36})
    .trim()
];

export { registerValidators, loginValidators, settingsValidators };