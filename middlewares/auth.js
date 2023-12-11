const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { NODE_ENV, JWT_SECRET } = process.env;

const checkAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new UnauthorizedError('Вы не авторизованы'));
      return;
    }
    const token = authorization.split(' ')[1];
    const result = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'VERY_SECRET_KEY');
    if (result) {
      req.user = {
        _id: result._id
      }
      next();
    }
  }
  catch (err) {
    if (err instanceof JsonWebTokenError) {
      next(new UnauthorizedError('Ошибка авторизации'));
      return;
    }
    return next(err);
  }
}

module.exports = checkAuth;