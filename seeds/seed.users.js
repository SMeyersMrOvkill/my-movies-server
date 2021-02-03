require('dotenv').config()
const bcrypt = require('bcryptjs');
const knex = require('knex');
const { PORT, DATABASE_URL, JWT_SECRET } = require('../src/config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

db('users').insert({
    id: 1,
    user_name: 'public',
    full_name: 'Public User',
    password: bcrypt.hashSync('guest', bcrypt.genSaltSync())
}).then(() => {
    console.log("Seeded user 1.");
}).catch(error => console.log(error));
