const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const saveMovie = async (req, res, next) => {
  try {
    const newMovie = new Movie(req.body);
    newMovie.owner = req._id;
    res.status(200).send(await newMovie.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(err);
    }
  }
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  if (!mongoose.isValidObjectId(movieId)) {
    next(new BadRequestError('Невозможно удалить карточку: невалидный _id'));
  } else {
    Movie.findById(movieId)
      .then((card) => {
        if (!card) {
          next(new NotFoundError('Карточка не найдена'));
        } else if (card.owner.toString() !== req.user._id) {
          next(new ForbiddenError('Невозможно удалить карточку: это не ваша карточка'));
        } else {
          Movie.deleteOne({ _id: movieId })
            .then(() => {
              res.status(200).send({
                message: 'Карточка удалена',
              });
            });
        }
      })
      .catch(next);
  }
};

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
};