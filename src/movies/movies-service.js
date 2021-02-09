const MoviesService = {
  getAllMoviesForUser(db, user_id) {
    return db.from('movies').select('*').where('owner', user_id);
  },
  addMovie(db, movie) {
    return db.insert(movie).into('movies');
  },
  getMovieById(db, movieId) {
    return db('movies').select('*').where('id', movieId).first();
  },
  updateMovie(db, movie) {
    return db('movies').where('id', movie.id).update(movie);
  },
  deleteMovie(db, movieId) {
    return db('movies').delete().where('id', movieId);
  },
};

module.exports = MoviesService;