import { Router as router } from 'express';
import passport from 'passport';
import { DiscordGuestMiddleware } from '../middleware/Discord.js';
import { DiscordCallbackController } from '../controller/Discord.js';
import { GuestRateLimiterMiddleware } from '../middleware/RateLimiter.js';

const Router = router();

Router.get(
  '/login',

  DiscordGuestMiddleware,
  passport.authenticate('discord'),
);

Router.get(
  '/callback',
  GuestRateLimiterMiddleware,
  DiscordGuestMiddleware,
  passport.authenticate('discord', {
    failureRedirect: '/',
    failureMessage: 'There is an error bro! contact SKULL!',
  }),
  DiscordCallbackController,
);

export default Router;
