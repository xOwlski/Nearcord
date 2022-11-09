import { MongoClient } from 'mongodb';
import CONFIG from '../../Config.js';
import { AuthResTypes } from '../types/World.js';

const UserClient = new MongoClient(CONFIG('USER_URI'));
const UserDb = UserClient.db(CONFIG('DBNAME'));
export const UsersCol = UserDb.collection<AuthResTypes>(CONFIG('USER_COL'));

export default UserDb;
