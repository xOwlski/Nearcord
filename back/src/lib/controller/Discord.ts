import { CustomReqTypes } from '../types/World.js';
import { Response } from 'express';
import { UsersCol } from '../client/UserMongodb.js';

export const DiscordCallbackController = async (
  req: CustomReqTypes,
  res: Response,
) => {
  const User = req.user || null;

  if (User) {
    const UserObjectResponse = await UsersCol.findOne({
      'social.discord': User.id,
    });

    if (!UserObjectResponse) {
      await UsersCol.insertOne({
        social: { discord: User.id, twitter: null, near: null },
        avatar: { discord: User.avatar },
      });
    }
  }

  return res.redirect('/');
};
