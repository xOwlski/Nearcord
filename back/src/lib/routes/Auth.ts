import { Router as router } from 'express';
import { DiscordAuthMiddleware } from '../middleware/Discord.js';
import {
  AuthInfoController,
  AuthLogoutController,
} from '../controller/Auth.js';
import { GuestRateLimiterMiddleware } from '../middleware/RateLimiter.js';

const Router = router();

Router.get('/info', GuestRateLimiterMiddleware, AuthInfoController);

Router.get('/logout', DiscordAuthMiddleware, AuthLogoutController);

export default Router;
