import Cookies from 'cookies';
import { Request, Response } from 'express';
import CONFIG from '../../Config.js';
import { ChaCha20 } from '../crypt/ChaCha.js';
import Time from './TimeFuns.js';
import { NearCallbackTypes, UMsgCookie } from '../types/World.js';
import { NearCallbackSchema } from '../schema/World.js';
import VerifySignature from '../crypt/VerifySignature.js';
import ValidPublicKey from './ValidPublicKey.js';

const Authorised = async (REQ: Request, RES: Response) => {
  try {
    // Cookie checking
    const cookies = new Cookies(REQ, RES);

    const UMSGCookie = cookies.get('UMsg') || null;

    if (!UMSGCookie) {
      return false;
    }

    cookies.set('UMsg');

    // Cookie Decryption
    const DecUMsgCookie = await ChaCha20.Dec({
      KEY: CONFIG('S_SEC'),
      INPUT: UMSGCookie,
    });

    if (DecUMsgCookie.status !== 200) {
      console.error('Cookie dec => ', DecUMsgCookie.status, DecUMsgCookie.res);
      return false;
    }

    // TimeStamp Checking
    const DecUMsgCookieObj: UMsgCookie = JSON.parse(DecUMsgCookie.res);

    if (!Time.Check(DecUMsgCookieObj.time)) {
      return false;
    }

    // Checking body
    const BODY: NearCallbackTypes = REQ.body;

    try {
      await NearCallbackSchema.validateAsync(BODY);
    } catch (error: any) {
      console.error('While checking req body mint nft => ', error);
      return false;
    }

    // Check signature
    if (
      !VerifySignature({
        MSG: DecUMsgCookieObj.umsg,
        SIGNATURE: BODY.signature,
        PUBKEY: BODY.publicKey,
      })
    ) {
      return false;
    }

    // Checking Public Key
    const VerificationRes = await ValidPublicKey({
      ACCOUNTID: BODY.accountId,
      PUBLICKEY: BODY.publicKey,
    });

    if (!VerificationRes) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('From authorised function => ', error);
    return false;
  }
};

export default Authorised;
