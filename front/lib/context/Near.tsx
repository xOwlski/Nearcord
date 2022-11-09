/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { WalletConnection } from 'near-api-js';
import { useRouter } from 'next/router';
import { NEARContextTypes } from '../types/Context';
import { createGenericContext } from './CreateContext';
import GetWalletCon from '../functions/GetWalletCon';
import { AuthResTypes, NearCallbackTypes } from '../types/World';
import { Decodeuint8arr } from '../functions/Uint8ToStr';
import { FetchPost } from '../functions/FetchPost';
import DiscordImgUrl from '../functions/DiscordImg';

const [useNearContext, NearContextProvider] =
  createGenericContext<NEARContextTypes>();

const NearProvider = ({ children }: { children: React.ReactNode }) => {
  // States
  const [DiscordAcc, setDiscordAcc] = useState<string | null>(null);
  const [TwitterAcc, setTwitterAcc] = useState<string | null>(null);
  const [NearAcc, setNearAcc] = useState<string | null>(null);

  const [DiscordImg, setDiscordImg] = useState<string | null>(null);

  const [AlertTxt, setAlertTxt] = useState<string | null>(null);

  const [PriLoading, setPriLoading] = useState(false);

  const Router = useRouter();

  const [WalletConnectionCC, setWalletConnectionCC] =
    useState<WalletConnection | null>(null);

  // Near
  const NearLogin = async () => {
    const WalletConnectionC = await GetWalletCon();

    WalletConnectionC.requestSignIn({
      contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
      methodNames: [],
    });
  };

  const GetAccounts = async () => {
    setPriLoading(true);
    const AccRes = await fetch('/auth/info');

    if (AccRes.ok) {
      const AuthResBody: AuthResTypes = await AccRes.json();

      setDiscordAcc(AuthResBody.social.discord);
      setTwitterAcc(AuthResBody.social.twitter);
      setNearAcc(AuthResBody.social.near);

      if (AuthResBody.social.discord && AuthResBody.avatar.discord) {
        setDiscordImg(
          DiscordImgUrl({
            ID: AuthResBody.social.discord,
            AV: AuthResBody.avatar.discord,
          })
        );
      } else {
        setDiscordImg(null);
      }
    } else {
      setDiscordImg(null);
      setDiscordAcc(null);
      setTwitterAcc(null);
      setNearAcc(null);
    }

    setPriLoading(false);
  };

  const BootFunction = async () => {
    setPriLoading(true);
    const WALLETCONNECTION = await GetWalletCon();

    if (WALLETCONNECTION.isSignedIn()) {
      try {
        const SignatureRes = await fetch('/auth/near/login');

        if (SignatureRes.ok) {
          const SignatureResObj: { Data: string } = await SignatureRes.json();

          const KeyPair = await WALLETCONNECTION._keyStore.getKey(
            WALLETCONNECTION._networkId,
            WALLETCONNECTION.getAccountId()
          );

          const UMsg = Buffer.from(SignatureResObj.Data || '');

          const { signature } = KeyPair.sign(UMsg);

          const NFTCallBody: NearCallbackTypes = {
            signature: Decodeuint8arr(signature),
            accountId: WALLETCONNECTION.getAccountId(),
            publicKey: KeyPair.getPublicKey().toString(),
          };

          const CallbackRes = await FetchPost(
            '/auth/near/callback',
            NFTCallBody
          );

          if (CallbackRes.redirected) {
            console.log(CallbackRes.url);
            Router.push(CallbackRes.url);
          }
        }
      } catch (error) {
        console.error('From Near Context');
        console.error(error);
      }

      WALLETCONNECTION.signOut();
      GetAccounts();
    }

    setPriLoading(false);
  };

  useEffect(() => {
    console.info(process.env.NEXT_PUBLIC_ENV);
    console.info(process.env.NEXT_PUBLIC_CONTRACT_NAME);
    console.info(process.env.NODE_ENV);
    GetAccounts();
    GetWalletCon().then((CON) => setWalletConnectionCC(CON));
  }, []);

  useEffect(() => {
    const SignStatus = WalletConnectionCC?.isSignedIn() || false;
    if (SignStatus) {
      BootFunction();
    }
  }, [WalletConnectionCC]);

  useEffect(() => {
    const { msg, all_keys } = Router.query;

    if (msg) {
      setAlertTxt(msg.toString());
    } else {
      setAlertTxt(null);
    }

    if (all_keys) {
      Router.replace('/');
    }
  }, [Router.isReady, Router]);

  return (
    <NearContextProvider
      value={{
        NearLogin,
        DiscordAcc,
        TwitterAcc,
        NearAcc,
        AlertTxt,
        PriLoading,
        DiscordImg,
      }}
    >
      {children}
    </NearContextProvider>
  );
};

export { useNearContext, NearProvider };
