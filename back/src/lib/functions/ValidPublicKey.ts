import { connect, keyStores } from 'near-api-js';
import CONFIG from '../../Config.js';
import GetConfig from '../../Config.near.js';
import { PublicKeyVerificationResTypes } from '../types/World.js';
import ValidAccountId from './ValidAccId.js';
import Sleep from './Sleep.js';

const ValidPublicKey = async ({
  ACCOUNTID,
  PUBLICKEY,
}: {
  PUBLICKEY: string;
  ACCOUNTID: string;
}) => {
  try {
    if (!ValidAccountId(ACCOUNTID)) {
      return false;
    }

    const KeyStore = new keyStores.InMemoryKeyStore();

    const ConnectionConfig = GetConfig({
      ENV: CONFIG('L_ENV'),
      KEYSTORE: KeyStore,
    });

    const NearConnection = await connect(ConnectionConfig);

    let Response = false;

    for (let i = 0; i <= 10; i++) {
      try {
        const VerificationRes: PublicKeyVerificationResTypes =
          await NearConnection.connection.provider.query({
            request_type: 'view_access_key',
            finality: 'final',
            account_id: ACCOUNTID,
            public_key: PUBLICKEY,
          });

        if (
          VerificationRes.permission.FunctionCall.receiver_id !==
          CONFIG('L_CONTRACT_NAME')
        ) {
          Response = false;
          break;
        }

        Response = true;
        break;
      } catch (error) {
        Response = false;
        console.error(error);
        console.error('Error while checking but gonna retry !!');
        Sleep(300);
      }
    }

    console.log('\n\nResponse => ', Response, '\n\n');

    return Response;
  } catch (error) {
    console.error('While checking public key => ', error);
    return false;
  }
};

export default ValidPublicKey;
