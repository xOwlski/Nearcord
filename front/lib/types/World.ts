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

export interface NearCallbackTypes {
  accountId: string;
  publicKey: string;
  signature: string;
}
