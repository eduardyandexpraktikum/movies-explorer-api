const userRouter = require('express').Router();
const {
  profileValidator,
} = require('../middlewares/validation');

const {
  getMe,
  patchMe,
} = require('../controllers/users');

userRouter.get('/me', getMe);
userRouter.patch('/me', profileValidator, patchMe);

module.exports = userRouter;
