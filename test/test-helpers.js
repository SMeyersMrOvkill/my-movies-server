const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function getUsersTestData() {
    return [
        {
            id: 1,
            user_name: 'testuser',
            full_name: 'Test User',
            password: bcrypt.hashSync('password', bcrypt.genSaltSync())
        }
    ];
}

function getMoviesTestData() {
    return [
        {
            id: 5,
            name: 'Test Movie 1',
            description: 'The first test movie.',
            rating: 1,
            genre: 'Action',
            owner: 1
        },
        {
            id: 6,
            name: 'Test Movie 2',
            description: 'The second test movie.',
            rating: 3,
            genre: 'Adventure',
            owner: 1
        },
        {
            id: 7,
            name: 'Test Movie 3',
            description: 'The third test movie.',
            rating: 5,
            genre: 'Science Fiction',
            owner: 1
        }
    ];
}

function cleanTables(db) {
    return db.raw(`
        TRUNCATE users, movies CASCADE
    `);
}

function getAuthToken(user_id, user_name) {
    return jwt.sign(
        {user_id},
        process.env.JWT_SECRET,
        {
            subject: user_name,
            algorithm: 'HS256'
        }
    );
}

function seedUsers(db) {
    return db('users').insert(getUsersTestData());
}

function seedMovies(db) {
    return db('movies').insert(getMoviesTestData());
}

module.exports = {
    getUsersTestData,
    getMoviesTestData,
    cleanTables,
    getAuthToken,
    seedUsers,
    seedMovies
}