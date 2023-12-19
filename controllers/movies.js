const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
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
    newMovie.owner = req.user._id;
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
    next(new BadRequestError('Невозможно удалить фильм: невалидный _id'));
  } else {
    Movie.findById(movieId)
      .then((movie) => {
        if (!movie) {
          return next(new NotFoundError('Фильм не найден'));
        }
        return Movie.deleteOne({ _id: movieId })
          .then(() => {
            res.status(200).send({
              message: 'Фильм удален',
            });
          });
      })
      .catch(next);
  }
};

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
};
