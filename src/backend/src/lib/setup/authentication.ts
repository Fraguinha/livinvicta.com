import bcrypt from 'bcryptjs'
import MongoStore from 'connect-mongo'
import { Express } from 'express'
import session from 'express-session'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
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
      cookie: {
        secure: process.env.NODE_ENV === "production",
      },
      store: MongoStore.create({
        mongoUrl: process.env.DATABASE || 'mongodb://mongo:27017/livinvicta',
        collectionName: 'sessions',
      }),
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

  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "https://livinvicta.com/api/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) => {
        let user = await User.findOne({ googleId: profile.id })
        if (!user) {
          user = await User.create({
            email: profile.emails?.[0].value,
            googleId: profile.id,
            role: "user",
          })
        }
        return done(null, user)
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
