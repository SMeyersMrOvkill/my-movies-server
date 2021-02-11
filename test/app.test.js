const AuthService = require('../src/auth/auth-service');
const helpers = require('./test-helpers');
const app = require('../src/app');
const knex = require('knex')
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

describe('Test Setup', () => {
    let db;
    
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        });
        app.set('db', db);
    })

    afterEach('clean tables', () => helpers.cleanTables(db));

    after('disconnect from db', () => {
        db.destroy();
    })

    before('cleanup', () => helpers.cleanTables(db));

    describe('Auth router', () => {

        beforeEach('seed users', () => {
            return helpers.seedUsers(db);
        });

        it('Registers a new user successfully', () => {
            const newUser = {
                user_name: 'TestUser3',
                full_name: 'Test User 3',
                password: 'test'
            }
            return supertest(app)
            .post('/api/auth/register')
            .send(newUser)
            .expect(200)
        });

        it('Requires user_name, full_name, and password', () => {
            return supertest(app)
            .post('/api/auth/register')
            .expect(400)
        });

        it(`responds with 400 'invalid user_name or password' when given a bad password`, () => {
            const invalidUser = {
                user_name: 'TestUser',
                password: 'bad password'
            }
            return supertest(app)
            .post('/api/auth/login')
            .send(invalidUser)
            .expect(400)
        });

        it('responds with 200 and JWT auth token using secret when given valid credentials', () => {
            const validUser = {
                user_name: 'testuser',
                password: 'password'
            }
            return supertest(app) 
                .post('/api/auth/login')
                .send(validUser)
                .expect(200)
        });

        it('Requires a username and password', () => {
            return supertest(app)
            .post('/api/auth/login')
            .expect(400)
        });
    });

    describe('Movies Router', () => {
        beforeEach('seed users', () => {
            return helpers.seedUsers(db);
        });
        
        beforeEach('seed movies', () => {
            return helpers.seedMovies(db);
        });

        it('Returns an array of movies from /api/movies', () => {
            const token = helpers.getAuthToken(1, 'testuser');
            return supertest(app)
            .get('/api/movies')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        });

        it('Requires auth to access /api/movies', () => {
            return supertest(app)
            .get('/api/movies')
            .expect(401)
        });

        it('Adds a new movie when given valid data', () => {
            const newMovie = {
                name: 'TestMovie2',
                description: 'A movie for testing',
                rating: 3,
                genre: 'Science Fiction'
            };
            const token = helpers.getAuthToken(1, 'testuser');
            return supertest(app)
            .post('/api/movies/add')
            .set('Authorization', `Bearer ${token}`)
            .send(newMovie)
            .expect(200);
        });

        it('Requires auth to access /api/movies/add', () => {
            return supertest(app)
            .post('/api/movies/add')
            .expect(401)
        });

        it('Updates a movie when given valid data', () => {
            const updatedMovie = {
                id: 5,
                name: 'Test Updated Movie2',
                description: 'A test movie update',
                rating: 1,
                genre: 'Adventure',
                owner: 1
            };
            const token = helpers.getAuthToken(1, 'testuser');
            return supertest(app)
            .put(`/api/movies/${updatedMovie.id}/update`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedMovie)
            .expect(201);
        });

        it('Requires auth to access /api/movies/:movieId/update', () => {
            return supertest(app)
            .put('/api/movies/5/update')
            .expect(401);
        });

        it('Deletes a movie when given an id and proper auth', () => {
            const token = helpers.getAuthToken(1, 'testuser');
            return supertest(app)
            .delete('/api/movies/5/delete')
            .set('Authorization', `Bearer ${token}`)
            .expect(201);
        });

        it('Requires auth to access /api/movies/:movieId/delete', () => {
            return supertest(app)
            .delete('/api/movies/5/delete')
            .expect(401);
        });
    });
});