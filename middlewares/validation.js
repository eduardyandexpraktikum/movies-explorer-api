const { Joi, celebrate } = require('celebrate');

const regularEx = /^(http|https):\/\/(?:www\.)?[a-zA-Z0-9._~\-:?#[\]@!$&'()*+,/;=]{2,256}\.[a-zA-Z0-9./?#-]{2,}$/;

const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const profileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const saveMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().integer().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regularEx),
    trailerLink: Joi.string().required().regex(regularEx),
    thumbnail: Joi.string().required().regex(regularEx),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  signInValidator,
  signUpValidator,
  profileValidator,
  saveMovieValidator,
  deleteMovieValidator,
};

// country: String
// director: String
// duration: Number
// year: Number
// description: String
// image: String
// trailerLink: String
// thumbnail: String
// movieId: Number
// nameRU: String,
// nameEN: String,
