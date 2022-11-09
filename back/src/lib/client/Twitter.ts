import { TwitterApi } from 'twitter-api-v2';
import CONFIG from '../../Config.js';

export const TwitterClient = new TwitterApi({
  clientId: CONFIG('T_KEY'),
  clientSecret: CONFIG('T_SEC'),
});
