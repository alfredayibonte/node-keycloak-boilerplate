import { config} from 'dotenv';
import express from 'express';
import session from 'express-session'
import passport from 'passport';
import { Strategy as OpenIDConnectStrategy, Profile, VerifyCallback } from 'passport-openidconnect';

import HomeControllers from 'controllers/HomeController';
import ProfileController from 'controllers/ProfileController';

config()

const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user: any, done) {
  done(null, user);
});

const keycloakStrategy = new OpenIDConnectStrategy({
  issuer: process.env.KC_ISSUER!,
  authorizationURL: process.env.KC_AUTHORIZATION_URL!,
  tokenURL: process.env.KC_TOKEN_URL!,
  userInfoURL: process.env.KC_USERINFO_URL!,
  clientID: process.env.KC_CLIENT_ID!,
  clientSecret: process.env.KC_CLIENT_SECRET!,
  callbackURL: process.env.KC_CALLBACK_URL!
}, (issuer: string,
  profile: Profile,
  context: object,
  idToken: string | object,
  accessToken: string | object,
  refreshToken: string,
  done: VerifyCallback) => {
    return done(null, profile);
});
passport.use('keycloak', keycloakStrategy)

app.get('/', HomeControllers.index)
app.get('/callback', passport.authenticate('keycloak', { failureRedirect: '/', successRedirect: '/profile' }))
app.get('/login', passport.authenticate('keycloak', { failureRedirect: '/login' }))
app.get('/profile', ProfileController.index)


export default app;