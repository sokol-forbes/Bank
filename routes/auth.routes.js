const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { probabilities } = require('../utils/gameMethods');

// /api/auth/register
router.post(
  '/register',
  [
    check('username', 'Ник некорректный 4 симв минимум.').isLength({ min: 4 }),
    check('password', 'Пароль некорректный 6 симв минимум.').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации.',
        });
      }

      const { username, password } = req.body;

      const candidate = await User.findOne({ username });

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Такой пользователь уже существует.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        username,
        password: hashedPassword,
        isAdmin: false,
        gameMethod: probabilities ? 0 : 1,
        koef: Math.random(),
      });

      await user.save();

      res.status(201).json({ message: 'Пользователь создан!' });
    // } catch (e) {
      // res
        // .status(500)
        // .json({ message: 'Что-то пошло не так, попробуйте снова.' });
    // }
  }
);

// /api/auth/login
router.post(
  '/login',
  [
    check('username', 'Ник некорректный 4 симв минимум.').isLength({ min: 4 }),
    check('password', 'Пароль некорректный 6 симв минимум.').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при авторизации.',
        });
      }

      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Неверный пароль, попробуйте снова.' });
      }

      const token = jwt.sign({ _id: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      });

      res.json({
        user: { token, ...user._doc },
        message: 'Вы успешно войли в аккаунт.',
      });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так, попробуйте снова.' });
    }
  }
);

module.exports = router;
