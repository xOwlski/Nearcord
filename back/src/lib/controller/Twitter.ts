import { Request, Response } from 'express';
import { UsersCol } from '../client/UserMongodb.js';
import { TwitterClient } from '../client/Twitter.js';
import { CustomReqTypes } from '../types/World.js';
import CONFIG from '../../Config.js';

export const TwitterLoginController = (req: Request, res: Response) => {
  const { url, codeVerifier, state } = TwitterClient.generateOAuth2AuthLink(
    CONFIG('BACK_URL') + '/auth/twitter/callback',
    { scope: ['tweet.read', 'users.read', 'offline.access'] },
  );

  req.session.codeVerifier = codeVerifier;
  req.session.state = state;

  res.redirect(url);
};

export const TwitterCallbackController = async (
  req: CustomReqTypes,
  res: Response,
) => {
  const { state, code } = req.query;
  const { codeVerifier, state: sessionState } = req.session;

  if (!codeVerifier || !state || !sessionState || !code) {
    return res.redirect('/');
  }

  if (state !== sessionState) {
    return res.redirect('/');
  }

  TwitterClient.loginWithOAuth2({
    code: code as string,
    codeVerifier,
    redirectUri: CONFIG('BACK_URL') + '/auth/twitter/callback',
  }).then(async ({ client: loggedClient }) => {
    const { data: userObject } = await loggedClient.v2.me();

    const User = req.user || null;

    if (User) {
      const TwitterSearchRes = await UsersCol.findOne({
        'social.twitter': userObject.id,
      });

      if (TwitterSearchRes) {
        return res.redirect(
          '/?msg=Twitter Account Already Connected To Some Other User&openm=false',
        );
      } else {
        await UsersCol.updateOne(
          { 'social.discord': User.id },
          {
            $set: {
              'social.twitter': userObject.id,
            },
          },
        );
      }
    }

    return res.redirect('/');
  });
};
