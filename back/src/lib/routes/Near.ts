import Cookies from 'cookies';
import { Response, Router as router } from 'express';
import { nanoid } from 'nanoid';
import CONFIG from '../../Config.js';
import { UsersCol } from '../client/UserMongodb.js';
import Authorised from '../functions/Near.js';
import { ChaCha20 } from '../crypt/ChaCha.js';
import Time from '../functions/TimeFuns.js';
import { CustomReqTypes } from '../types/World.js';
import { NearCallbackTypes } from '../types/World.js';
import AuthReqProtectorMiddleware from '../middleware/AuthReq.js';
import ServerLogout from '../functions/ServerLogout.js';
import { NearCallbackSchema } from '../schema/World.js';
import { AuthRateLimiterMiddleware } from '../middleware/RateLimiter.js';

const Router = router();

Router.get(
  '/login',
  AuthRateLimiterMiddleware,
  AuthReqProtectorMiddleware,
  async (req, res) => {
    const cookies = new Cookies(req, res);

    const UMsg = nanoid(25);

    /**
     * Time.Gen(20) will generate timestamp valid for 20 seconds
     * Check that timestamp using Time.Check(TIMESTAMP)
     */
    const EncCookie = await ChaCha20.Enc({
      KEY: CONFIG('S_SEC'),
      INPUT: JSON.stringify({ umsg: UMsg, time: Time.Gen(5) }),
    });

    if (EncCookie.status === 200) {
      cookies.set('UMsg', EncCookie.res);
      res.status(200).json({ Data: UMsg });
    } else {
      console.error('Error in signature function near');
      res.redirect('/?msg=Error while generating signature');
    }
  },
);

Router.post(
  '/callback',
  AuthRateLimiterMiddleware,
  AuthReqProtectorMiddleware,
  async (req: CustomReqTypes, res: Response) => {
    try {
      const User = req.user || null;
      const BODY: NearCallbackTypes = req.body;

      try {
        await NearCallbackSchema.validateAsync(BODY);
      } catch (error) {
        console.error(error);

        return res.status(400);
      }

      if (!User) {
        ServerLogout(req);
        return res.redirect('/?msg=Unauthorized!');
      }

      const NearSearchRes = await UsersCol.findOne({
        'social.near': BODY.accountId,
      });

      if (NearSearchRes) {
        return res.redirect(
          '/?msg=Near Account Already Connected To Some Other User',
        );
      }

      if (!(await Authorised(req, res))) {
        ServerLogout(req);
        return res.redirect('/?msg=Unauthorized');
      }

      await UsersCol.updateOne(
        { 'social.discord': User.id },
        {
          $set: {
            'social.near': BODY.accountId,
          },
        },
      );

      return res.redirect('/');
    } catch (error) {
      console.error('near callback => ', error);
      return res.redirect('/?msg=Error while logging user with Near wallet');
    }
  },
);

export default Router;
