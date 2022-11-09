/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
// import helmet from 'helmet';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import compression from 'compression';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as DStrategy } from 'passport-discord';
import OAuth2Strategy from 'passport-oauth2';
import expressSession from 'express-session';
import CONFIG from './Config.js';

declare module 'express-session' {
  interface SessionData {
    codeVerifier?: string;
    state?: string;
  }
}

// Routes
import DiscordRoutes from './lib/routes/Discord.js';
import TwitterRoutes from './lib/routes/Twitter.js';
import AuthRoutes from './lib/routes/Auth.js';
import NearRoutes from './lib/routes/Near.js';

const App = express();
const Port = process.env.PORT || 9898;

// App.use(helmet());
// App.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       'default-src': ["'self'", 'cdn.discordapp.com'],
//     },
//   }),
// );
App.disable('x-powered-by');

// CORS =============================
App.use(cors());
// ==================================

App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(compression());
App.use(morgan('dev'));

// Discord && Twitter

const scope = ['identify', 'email'];

const DiscordStrategy = new DStrategy(
  {
    clientID: CONFIG('D_CLIENT_ID'),
    clientSecret: CONFIG('D_CLIENT_SECRET'),
    callbackURL: CONFIG('BACK_URL') + '/auth/discord/callback',
    scope,
  },
  (
    _accessToken: string,
    _refreshToken: string,
    profile: DStrategy.Profile,
    done: OAuth2Strategy.VerifyCallback,
  ) => {
    process.nextTick(() => done(null, profile));
  },
);

passport.use(DiscordStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user as any);
});

// Server

App.use(
  expressSession({
    secret: CONFIG('S_SEC'),
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: CONFIG('SESSION_URI'),
      dbName: CONFIG('DBNAME'),
      ttl: 30 * 60,
      autoRemove: 'interval',
      touchAfter: 24 * 3600,
    }),
  }),
);
App.use(passport.initialize());
App.use(passport.session());

// Using Routes
App.use('/auth/discord', DiscordRoutes);
App.use('/auth/twitter', TwitterRoutes);
App.use('/auth/near', NearRoutes);
App.use('/auth', AuthRoutes);

App.use("/" , express.static("frontend"))

App.get('*', (_req, res) => {
  res.sendStatus(404);
});

App.listen(Port, () => {
  console.log(
    `Free Mint Listening On Port - ${Port}\n\nlocal-ssl-proxy --source 9879 --target ${Port}`,
  );
});
