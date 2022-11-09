import { Request } from 'express';
import { CustomReqTypes } from '../types/World.js';

const ServerLogout = (REQ: Request | CustomReqTypes) => {
  REQ.logout({ keepSessionInfo: false }, (err: string) => console.error(err));
};

export default ServerLogout;
