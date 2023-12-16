// const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const signUp = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hash,
      name,
    });
    return res.status(201).send({
      email: newUser.email,
      name: newUser.name,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Такой email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  }
  return (next);
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Неподходящий логин и/или пароль'));
    }
    const loginUser = await User.findOne({ email }).select('+password');
    if (!loginUser) {
      return next(new UnauthorizedError('Некорректный логин и/или пароль'));
    }
    const result = bcrypt.compare(password, loginUser.password)
      .then((matched) => {
        if (!matched) {
          return false;
        }
        return true;
      });
    if (!result) {
      return next(new ForbiddenError('Некорректный логин и/или пароль'));
    }
    const token = jwt.sign({ _id: loginUser._id }, NODE_ENV === 'production' ? JWT_SECRET : 'VERY_SECRET_KEY', { expiresIn: '7d' });
    res.status(200).send({ token, email });
  } catch (err) {
    next(err);
  }
  return (next);
};

const getMe = (req, res, next) => {
  const myself = req.user._id;
  User.findById(myself)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет информации'));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const patchMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.email = req.body.email;
    return res.status(201).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  signUp,
  signIn,
  getMe,
  patchMe,
};
