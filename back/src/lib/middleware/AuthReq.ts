import { NextFunction, Response } from 'express';
import { UsersCol } from '../client/UserMongodb.js';
import { CustomReqTypes } from '../types/World.js';

const ProtectedPaths = ['discord', 'twitter', 'near', 'nft'];

const AuthReqProtectorMiddleware = async (
  req: CustomReqTypes,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('\n Protector called \n');

    if (!req.isAuthenticated()) {
      return res.redirect(`/auth/discord/login`);
    }

    const SplittedPath = '/auth/discord/login'.split('/');

    if (SplittedPath.length !== 4) {
      return res.redirect('/?msg=Unauthorized');
    }

    if (!ProtectedPaths.includes(SplittedPath[2])) {
      return res.redirect('/?msg=Unauthorized');
    }

    const AuthType = SplittedPath[2];

    const User = req.user || null;

    const UserSocialObject = await UsersCol.findOne({
      'social.discord': User.id,
    });

    switch (AuthType) {
      case 'discord': {
        return next();
      }

      case 'twitter': {
        if (!UserSocialObject.social.discord) {
          return res.redirect('/auth/discord/login');
        }
        return next();
      }

      case 'near': {
        if (!UserSocialObject.social.twitter) {
          return res.redirect('/auth/twitter/login');
        }
        return next();
      }

      case 'nft': {
        if (!UserSocialObject.social.near) {
          return res.redirect('/?redirect=near');
        }
        return next();
      }

      default: {
        return res.redirect('/?msg=Unauthorized');
      }
    }
  } catch (error) {
    console.error('Error In Authenticated Request ');
    return res.redirect('/?msg=Error while protecting routes');
  }
};

export default AuthReqProtectorMiddleware;
