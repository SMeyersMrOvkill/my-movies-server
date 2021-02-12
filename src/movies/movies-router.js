const express = require('express');
const MoviesService = require('./movies-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { json } = require('express');

const moviesRouter = express.Router();
const jsonBodyParser = express.json();

/**
 * Returns the list of movies owned by the current logged in user.
 * Outcomes:
 * Given user is logged in and sends proper Authorization: 200, {"movies": [Array of movies]}
 * Given user is not logged in or fails to send Authorization: 401, Unauthorized
 */
moviesRouter.route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    MoviesService.getAllMoviesForUser(
      req.app.get('db'), req.user.id
    ).then(movies => {
      res.status(200).json(movies);
    })
  });

/**
 * Adds a new movie to the list of the user's owned movies.
 * Outcomes:
 * Given valid Authorization and valid movie - 200, {status: 0}
 * Given valid Authorization and invalid or missing movie - 400, {status: -1, message: `Must include ${key} in request body`} 
 * Given invalid or missing Authorization - 401, Unauthorized
 */
moviesRouter.route('/add')
  .all(requireAuth)
  .all(jsonBodyParser)
  .post((req, res, next) => {
    const { name, description, rating, genre } = req.body;
    const movie = {
      name, description, rating, genre, owner: req.user.id
    };
    for(const [key, value] of Object.entries(movie)) {
      if(value === null) {
        return res.status(400).json({
          status: -1,
          message: `Must include '${key}' in request body.`
        });
      }
    }
    MoviesService.addMovie(req.app.get('db'), movie).then(result => {
      return res.status(200).json({status: 0});
    });
  });

/**
 * Updates a movie with an ID of :movieId according to request.
 * Given valid Authorization, :movieId exists, AND valid movie data - 201
 * Given valid Authorization, :movieId exists, AND invalid or incomplete movie data - 400, {"message": "Missing ${key} in request body"}
 * Given valid Authorization AND :movieId does not exist - 404, {"message": "No such movie exists with id :movieId"}
 * Given invalid Authorization - 401, Unauthorized
 */
moviesRouter.route('/:movieId/update')
  .all(requireAuth)
  .all(checkMovieExists)
  .put((req, res, next) => {
    const { name, description, rating, genre, owner: originalOwner } = req.body;
    const { movieId } = req.params;
    const owner = req.user.id;
    const movie = {
      id: movieId,
      name, description, rating, genre,
      owner
    };
    for(const[key, value] of Object.entries(movie)) {
      if(value == null) {
        return res.status(400).json({
          message: `Missing '${key}' in request body.`
        });
      }
    }
    if(originalOwner !== owner) {
      return res.status(401).json({
        message: `User ${owner} does not have permission to modify user ${originalOwner}'s books!`
      });
    }
    MoviesService.updateMovie(req.app.get('db'), movie).then(resp => {
      return res.status(201).send();
    });
  });

/**
 * Deletes a movie with an ID of :movieId.
 * Given valid Authorization AND movieId exists - 201
 * Given valid Authorization AND movieId does not exist - 404, {"message": "No such movie exists with id ${movieId}"}
 * Given invalid Authorization - 401, Unauthorized
 */
moviesRouter.route('/:movieId/delete')
  .all(requireAuth)
  .all(checkMovieExists)
  .delete((req, res, next) => {
    const { movieId } = req.params;
    MoviesService.deleteMovie(req.app.get('db'), movieId).then(resp => {
      return res.status(201).send();
    })
  });

async function checkMovieExists(req, res, next) {
  const { movieId } = req.params;
  let existingMovie = MoviesService.getMovieById(req.app.get('db'),  movieId);
  if(existingMovie == null) {
    return res.status(404).json({
      message: `No such movie exists with id ${movieId}`
    });
  }
  next();
}

module.exports = moviesRouter;