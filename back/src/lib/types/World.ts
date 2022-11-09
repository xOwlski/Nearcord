import { Request } from 'express';
import { QueryResponseKind } from 'near-api-js/lib/providers/provider.js';

export interface AuthResTypes {
  avatar: {
    discord: string | null;
  };
  social: {
    discord: string | null;
    twitter: string | null;
    near: string | null;
  };
}

export interface CustomReqTypes extends Request {
  logout: any;
  isAuthenticated: any;
  user: { id: string; avatar: string };
}

export interface UMsgCookie {
  umsg: string;
  time: number;
}

export interface NearCallbackTypes {
  accountId: string;
  publicKey: string;
  signature: string;
}

export interface PublicKeyVerificationResTypes extends QueryResponseKind {
  permission: {
    FunctionCall: {
      allowance: string;
      method_names: string[];
      receiver_id: string;
    };
  };
}
