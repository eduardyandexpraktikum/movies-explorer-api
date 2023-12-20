const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const checkAuth = require('../middlewares/auth');
const { signUp, signIn } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const {
  signInValidator,
  signUpValidator,
} = require('../middlewares/validation');

router.post('/signin', signInValidator, signIn);
router.post('/signup', signUpValidator, signUp);

router.use(checkAuth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
