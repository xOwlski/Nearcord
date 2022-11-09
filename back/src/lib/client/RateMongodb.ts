import { MongoClient } from 'mongodb';
import { RateLimiterMongo } from 'rate-limiter-flexible';
import CONFIG from '../../Config.js';

const RateClient = new MongoClient(CONFIG('RATE_URI'));

export const RateAuthDb = new RateLimiterMongo({
  storeClient: RateClient,
  dbName: CONFIG('DBNAME'),
  tableName: CONFIG('RATE_COL'),
  keyPrefix: '',
  points: 50,
  duration: 60,
});

export const RateGuestDb = new RateLimiterMongo({
  storeClient: RateClient,
  dbName: CONFIG('DBNAME'),
  tableName: CONFIG('RATE_COL') + '-guest',
  keyPrefix: '',
  points: 20,
  duration: 60,
});
