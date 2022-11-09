import { Response } from 'express';
import { UsersCol } from '../client/UserMongodb.js';
import { CustomReqTypes } from '../types/World.js';

export const AuthInfoController = async (
  req: CustomReqTypes,
  res: Response,
) => {
  const User = req.user || null;

  if (User) {
    const SearchRes = await UsersCol.findOne({
      'social.discord': User.id,
    });

    if (SearchRes) {
      res.status(200).json(SearchRes);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
};

export const AuthLogoutController = (req: CustomReqTypes, res: Response) => {
  req.logout({ keepSessionInfo: false }, (err: string) => console.error(err));
  res.redirect('/');
};
