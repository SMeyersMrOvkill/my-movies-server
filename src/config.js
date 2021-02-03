module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://muffin:password@localhost/my-movies',
    JWT_SECRET: process.env.JWT_SECRET || 'my-movies-client-auth-token',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}