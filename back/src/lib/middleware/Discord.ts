import { NextFunction, Response } from 'express';
import { CustomReqTypes } from '../types/World.js';

export const DiscordAuthMiddleware = (
  req: CustomReqTypes,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) return res.redirect(`/auth/discord/login`);
  else return next();
};
export const DiscordGuestMiddleware = (
  req: CustomReqTypes,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) return res.redirect(`/`);
  else return next();
};
