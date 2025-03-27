import { config} from 'dotenv';
import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect';

import HomeControllers from 'controllers/HomeController';

config()

const app = express();
const memoryStore = new session.MemoryStore();

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 3600000 },
  store: memoryStore
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const kcConfig = {
  'confidential-port': 8080,
  'auth-server-url': 'http://localhost:8080/',
  'resource': process.env.KC_CLIENT_ID!,
  'ssl-required': 'external',
  'bearer-only': false,
  realm: process.env.KC_REALM_NAME!,
  credentials: {
    secret: process.env.KC_CLIENT_SECRET!
  }
}
const keycloak = new Keycloak({ store: memoryStore }, kcConfig);
app.use(keycloak.middleware());

// By default, the redirect URI is set to `http://localhost:3000/secure?auth_callback=1`.
// As a result, it's necessary to create a corresponding `/secure` route to handle the authentication callback properly.
app.get('/secure', keycloak.protect(), (req: any, res) => {
  res.json({ kauth: req.kauth });
})

app.get('/', HomeControllers.index)



export default app;