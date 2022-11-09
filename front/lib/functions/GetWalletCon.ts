import { connect, keyStores, WalletConnection } from 'near-api-js';
import GetConfig from '../Config';

const GetWalletCon = async () => {
  const KeyStore = new keyStores.BrowserLocalStorageKeyStore();

  const ConnectionConfig = GetConfig({
    ENV: 'testnet',
    KEYSTORE: KeyStore,
  });

  const NearConnection = await connect(ConnectionConfig);

  return new WalletConnection(NearConnection, 'Nearcord');
};

export default GetWalletCon;
