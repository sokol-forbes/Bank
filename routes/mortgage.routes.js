const { Router } = require('express');
const router = Router();
const Mortgage = require('../models/Mortgage');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

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

// /api/mortgages
router.get('/', async (req, res) => {
  try {
    const candidates = await Mortgage.find({});

    res.status(200).json(candidates);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.' });
  }
});

// /api/mortgages/add
router.patch(
  '/add',
  authenticateToken,
  [
    check('title', 'Название минимум 4 символа.').isLength({ min: 4 }),
    check('description', 'Описание минимум 10 символов.').isLength({ min: 10 }),
  ],
  async (req, res) => {
    try {
      const { user } = req;

      if (!user) {
        return res.status(400).json({ message: 'Неактивная сессия.' });
      }

      if (!user.isAdmin) {
        return res
          .status(500)
          .json({
            message:
              'Вы должны быть администратором чтобы выполнить это действие.',
          });
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при добавлении ипотеки.'
        })
      }

      const { title, description } = req.body;

      const mortgage = new Mortgage({
        title,
        description,
        percent: 70,
        usersCount: 0,
      })

      mortgage.save();

      res
        .status(201)
        .json({ mortgages: [...await Mortgage.find({}), mortgage], message: 'Ипотека добавлена!' });
    } catch (e) {
      console.log('error', e)
      res
        .status(500)
        .json({ message: 'Что-то пошло не так, попробуйте снова.' });
    }
  }
);

module.exports = router;
