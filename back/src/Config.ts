import dotenv from 'dotenv';

dotenv.config();

const CONFIG = (
  ENV:
    | 'USER_URI'
    | 'META_URI'
    | 'RATE_URI'
    | 'SESSION_URI'
    | 'DBNAME'
    | 'USER_COL'
    | 'RATE_COL'
    | 'META_COL'
    | 'D_CLIENT_ID'
    | 'D_CLIENT_SECRET'
    | 'T_KEY'
    | 'T_SEC'
    | 'S_SEC'
    | 'L_CONTRACT_NAME'
    | 'L_ENV'
    | 'RATE'
    | 'BACK_URL',
) => {
  const EnvRes = process.env[ENV] || null;

  if (!EnvRes) {
    throw new Error(`${ENV} not found in .env`);
  }

  return EnvRes;
};

export default CONFIG;
