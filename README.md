# My Movies

[Live Site](https://my-movies-client.vercel.app/)

# Api Documentation

## Public Routes

/api/auth/login - Allows a user to log in. - Returns: 200, {authToken: string} on valid request
+ user_name: string
+ password: string

/api/auth/register - Allows a user to register a new account. User name must be unique and not already taken. - Returns: 200, {status: 0, message: 'Ok'} on valid request
+ user_name: string
+ full_name: string
+ password: string

## Protected Routes ( All protected routes require Bearer authentication with valid JWT token )

POST /api/auth/refresh - Allows the system to refresh a valid but expired JWT token. - Returns 200, {authToken: string} on valid request.

GET /api/movies/ - Returns the list of movies owned by the current logged in user. - Returns 200, {movies: array} on valid request.

POST /api/movies/add - Adds a new movie to the list of the user's owned movies. - Returns 200, {status: 0} on valid request.
+ name: string
+ description: string
+ rating: number ( 1 - 5 inclusive )
+ genre: string

## Protected :movieId Routers ( All protected :movieId routes must replace :movieId with the id field on the given movie in the request string )

PUT /api/movies/:movieId/update - Updates the movie with an ID of :movieId. - Returns 201 on valid request.
+ name: string
+ description: string
+ rating: number ( 1 - 5 inclusive )
+ genre: string
+ owner: number ( must be the owner ID provided when the movie is requested from /api/movies/ )

DELETE /api/movies/:movieId/delete - Deletes the movie with an ID of :movieId. Returns 201 on valid request.

# Screenshots

![The Home page](https://my-movies-client.vercel.app/screenshots/MyMoviesHome.png)

![The Login page](https://my-movies-client.vercel.app/screenshots/MyMoviesLogin.png)

![The Movies page](https://my-movies-client.vercel.app/screenshots/MyMoviesMovies.png)

![The Add Movie page](https://my-movies-client.vercel.app/screenshots/MyMoviesAddMovie.png)

![The Edit Movie page](https://my-movies-client.vercel.app/screenshots/MyMoviesEditMovie.png)

![The View Movie page](https://my-movies-client.vercel.app/screenshots/MyMoviesViewMovie.png)

# Summary

My Movies is an app that will help you keep track of any DVDs/Blu-Rays/Other kinds of Movies you own!

It has storage, editing, sorting, and selection features to make your your movie choosing process is quick and easy!

It even has a public account set up so you can poke around and see how it works, details are on the home page of the app.

# Technology Used

+ React.js
+ Node.js
+ Express.js
+ PostgreSQL
+ HTML
+ CSS
+ Javascript