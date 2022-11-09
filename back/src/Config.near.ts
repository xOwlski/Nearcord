import { ConnectConfig } from 'near-api-js';
import {
  BrowserLocalStorageKeyStore,
  InMemoryKeyStore,
} from 'near-api-js/lib/key_stores';

const GetConfig = ({
  KEYSTORE,
  ENV,
}: {
  ENV: string;
  KEYSTORE: BrowserLocalStorageKeyStore | InMemoryKeyStore;
}): ConnectConfig => {
  switch (ENV) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        keyStore: KEYSTORE,
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        headers: {},
      };
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        keyStore: KEYSTORE,
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        headers: {},
      };
    case 'betanet':
      return {
        networkId: 'betanet',
        keyStore: KEYSTORE,
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        headers: {},
      };

    default:
      throw Error(
        `Unconfigured environment '${ENV}'. Can be configured in src/config.js.`,
      );
  }
};

export default GetConfig;
