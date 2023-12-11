const userRouter = require('express').Router();

const {
  getMe,
  patchMe,
} = require('../controllers/users');

userRouter.get('/me', getMe);
userRouter.patch('/me', patchMe);

module.exports = userRouter;