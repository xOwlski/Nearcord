import { PublicKey } from 'near-api-js/lib/utils/key_pair.js';
import { Encodeuint8arr } from '../functions/Uint8ToStr.js';

const VerifySignature = ({
  MSG,
  SIGNATURE,
  PUBKEY,
}: {
  MSG: string;
  SIGNATURE: string;
  PUBKEY: string;
}) => {
  try {
    const msg = Buffer.from(MSG);
    const publicKey = PublicKey.fromString(PUBKEY);
    const signature = Encodeuint8arr(SIGNATURE);

    return publicKey.verify(msg, signature);
  } catch (error) {
    console.error('Verify signature => ', error);
    return false;
  }
};

export default VerifySignature;
