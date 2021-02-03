const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')
const bcrypt = require('bcryptjs');

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect user_name or password',
          })

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect user_name or password',
              })

            const sub = dbUser.user_name
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload),
            })
          })
      })
      .catch(next)
  })

authRouter.post('/register', jsonBodyParser, (req, res, next) => {
  const { user_name, full_name, password } = req.body
  const newUser = {
    user_name,
    full_name,
    password: !!password ? bcrypt.hashSync(password, bcrypt.genSaltSync()) : null
  }
  for (const [key, value] of Object.entries(newUser))
    if (value == null)
      return res.status(400).json({
        status: -1,
        message: `Missing '${key}' in request body`
      });
    AuthService.getUserWithUserName(
      req.app.get('db'),
      newUser.user_name
    ).then((user) => {
      if(user) {
        return res.status(400).json({status: -1, message: "Username already registered"})
      }
      AuthService.createUser(req.app.get('db'), newUser).then(() => {
        return res.status(200).json({status: 0, message: "Ok"})
      })
    })
})

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name
  const payload = { user_id: req.user.id }
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  })
})

module.exports = authRouter
