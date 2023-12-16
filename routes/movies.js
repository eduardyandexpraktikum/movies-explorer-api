const movieRouter = require('express').Router();

const {
  getMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', saveMovie);
movieRouter.delete('/:id', deleteMovie);

module.exports = movieRouter;
