import express from 'express';
import session from 'express-session'
import passport from 'passport';
import { Strategy as OpenIDConnectStrategy, Profile, VerifyCallback } from 'passport-openidconnect';

import HomeControllers from 'controllers/HomeController';
import ProfileController from 'controllers/ProfileController';

const app = express();
app.use(session({
  secret: 'keyboard cat',
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
  issuer: 'http://localhost:8080/realms/keycloak-2',
  authorizationURL: 'http://localhost:8080/realms/keycloak-2/protocol/openid-connect/auth',
  tokenURL: 'http://localhost:8080/realms/keycloak-2/protocol/openid-connect/token',
  userInfoURL: 'http://localhost:8080/realms/keycloak-2/protocol/openid-connect/userinfo"',
  clientID: "nodeapp",
  clientSecret: "u7ygulmsyZLTC20JEuIsoby8Ry1MpNrF",
  callbackURL: 'http://localhost:3000/callback'
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