const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const Mortgage = require('../models/Mortgage');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { game_method } = require('../utils/gameMethods');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Файл должен быть только в расширениях jpeg/jpg/png'), false);
  }
};

const uploadAvatar = multer({ storage, fileFilter }).single('avatar');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.get('jwtSecret'), async (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: 'Сессия неактивна. Авторизируйтесь снова.' });
    req.user = await User.findOne({ _id: decoded });
    next();
  });
};

router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    uploadAvatar(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { user, body, file } = req;

      await check('nickname')
        .isLength({ min: 4 })
        .withMessage('Минимум 4 символа')
        .run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        file &&
          fs.unlink(
            path.join(__dirname, '../storage', file.filename),
            (err) => {
              if (err) return console.log('File remove error:', err);
            }
          );
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при изменении профиля.',
        });
      }

      if (
        body.nickname !== user.nickname &&
        (await User.findOne({ nickname: body.nickname }))
      ) {
        return res
          .status(500)
          .json({ message: 'Пользователь с таким никнеймом уже существует.' });
      }

      if (file) {
        user.avatar &&
          fs.unlink(path.join(__dirname, '../storage', user.avatar), (err) => {
            if (err) return console.log('File remove error:', err);
          });

        user.avatar = file.filename;
      }

      user.nickname = body.nickname;

      user.save();

      return res
        .status(200)
        .json({ user, message: 'Данные пользователя изменены.' });
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || 'Что-то пошло не так, попробуйте снова.' });
  }
});

router.patch('/:userId/closeMortgage/:mortgageId', authenticateToken, async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(400).json({ message: 'Неактивная сессия.' });
    }

    if (!user.isAdmin) {
      return res.status(500).json({
        message: 'Вы должны быть администратором чтобы выполнить это действие.',
      });
    }

    const { userId, mortgageId } = req.params;

    const candidate = await User.findOne({ _id: userId });

    if (!candidate) {
      return res.status(400).json({ message: 'Такого пользователя не существует.' });
    }

    candidate.links = candidate.links.filter(link => link.mortgageId !== mortgageId );

    await candidate.save();

    const users = await User.find({});

    res.status(201).json({ users, message: 'Ипотека отключена!' });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.' });
  }
});

router.patch('/:userId/update', authenticateToken, async (req, res) => {
  try {
    const { gameMethod, koef } = req.body;
    const { user } = req;

    if (!user) {
      return res.status(400).json({ message: 'Неактивная сессия.' });
    }

    if (!user.isAdmin) {
      return res.status(500).json({
        message: 'Вы должны быть администратором чтобы выполнить это действие.',
      });
    }

    const { userId } = req.params;

    const candidate = await User.findOne({ _id: userId });

    if (!candidate) {
      return res.status(400).json({ message: 'Такого пользователя не существует.' });
    }

    candidate.gameMethod = gameMethod;
    candidate.koef = koef;

    await candidate.save();

    const users = await User.find({});

    res.status(201).json({ users, message: 'Метод расчёта изменен!' });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.' });
  }
});

// /api/user/add_mortgage
router.patch(
  '/add_mortgage',
  authenticateToken,
  check('sum', 'Сумма неверная').isFloat({ min: 1000, max: 1000000 }),
  async (req, res) => {
    try {
      const { id, sum } = req.body;
      const { user } = req;

      if (!user) {
        return res.status(400).json({ message: 'Неактивная сессия.' });
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Некорректный данные.', errors: errors.array() });
      }

      const candidate = await user.links.find((link) => link.mortgageId === id);

      if (candidate) {
        return res.status(500).json({ message: 'Вы уже взяли эту ипотеку.' });
      }

      const { gameMethod, koef } = user;

      user.links.push({ mortgageId: id, ...game_method(gameMethod, koef), sum });

      await user.save();

      res.status(201).json({ links: user.links, message: 'Ипотека взята!' });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так, попробуйте снова.' });
    }
  }
);

// /api/user/users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(400).json({ message: 'Неактивная сессия.' });
    }

    if (!user.isAdmin) {
      return res.status(500).json({
        message: 'Вы должны быть администратором чтобы выполнить это действие.',
      });
    }

    const users = await User.find({});

    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.' });
  }
});

module.exports = router;
