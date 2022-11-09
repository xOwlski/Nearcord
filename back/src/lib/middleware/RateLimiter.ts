import { CustomReqTypes } from '../types/World.js';
import { Response, NextFunction } from 'express';
import ServerLogout from '../functions/ServerLogout.js';
import { RateAuthDb, RateGuestDb } from '../client/RateMongodb.js';
import CONFIG from '../../Config.js';

const RateActive = CONFIG('RATE') === 'true';

export const AuthRateLimiterMiddleware = (
  req: CustomReqTypes,
  res: Response,
  next: NextFunction,
) => {
  if (!RateActive) return next();

  const User = req.user || null;

  if (User) {
    RateAuthDb.consume(User.id, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        ServerLogout(req);
        res.redirect('/?msg=Too many request HUMAN BEING!');
      });
  } else {
    res.redirect('/auth/discord/login');
  }
};

export const GuestRateLimiterMiddleware = (
  req: CustomReqTypes,
  res: Response,
  next: NextFunction,
) => {
  if (!RateActive) return next();

  const User = req.user || null;

  if (!User) {
    RateGuestDb.consume(req.ip, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        ServerLogout(req);
        res.redirect('/?msg=Too many request HUMAN BEING!');
      });
  } else {
    res.redirect('/');
  }
};
