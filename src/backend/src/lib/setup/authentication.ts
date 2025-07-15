import bcrypt from 'bcryptjs'
import { Express } from 'express'
import session from 'express-session'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from '../../models/user.js'

const configure = (app: Express, secret: string) => {
  // Session
  if (process.env.NODE_ENV === "production") {
    app.set('trust proxy', 1)
  }
  app.use(
    session({
      secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: process.env.NODE_ENV === "production" },
    })
  )

  passport.use(
    new LocalStrategy.Strategy(
      { usernameField: 'email' },
      (email, password, done) => {
        // Match user
        User.findOne({ email }).then((user: any) => {
          if (!user) {
            return done(null, undefined)
          }
          // Match password
          bcrypt.compare(password, user.password, (_err, isMatch) => {
            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, undefined)
            }
          })
        })
      }
    )
  )

  passport.serializeUser((user: any, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id: any, done) => {
    User.findById(id).then((user: any) => {
      done(null, user)
    })
  })

  app.use(passport.initialize())
  app.use(passport.session())
}

export default { configure }
