const movieRouter = require('express').Router();
const {
  saveMovieValidator,
  deleteMovieValidator,
} = require('../middlewares/validation');

const {
  getMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', saveMovieValidator, saveMovie);
movieRouter.delete('/:id', deleteMovieValidator, deleteMovie);

module.exports = movieRouter;
