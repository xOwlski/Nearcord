import { Router as router } from 'express';
import {
  TwitterLoginController,
  TwitterCallbackController,
} from '../controller/Twitter.js';
import AuthReqProtectorMiddleware from '../middleware/AuthReq.js';
import { AuthRateLimiterMiddleware } from '../middleware/RateLimiter.js';

const Router = router();

Router.get(
  '/login',
  AuthRateLimiterMiddleware,
  AuthReqProtectorMiddleware,
  TwitterLoginController,
);

Router.get(
  '/callback',
  AuthRateLimiterMiddleware,
  AuthReqProtectorMiddleware,
  TwitterCallbackController,
);

export default Router;
