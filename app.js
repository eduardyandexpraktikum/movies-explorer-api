const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
const app = express();
const { json } = require('express');
const router = require('./routes');

app.use(cors());
app.use(json());
app.use(requestLogger);

app.use(router);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message
  });
  next();
});

app.listen(PORT);
