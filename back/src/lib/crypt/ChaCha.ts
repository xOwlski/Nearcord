import _sodium from 'libsodium-wrappers';
import LZString from 'lz-string';

/**
 * https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction
 */
export const ChaCha20 = {
  Enc: async ({ KEY, INPUT }: { KEY: string; INPUT: string }) => {
    await _sodium.ready;
    const Sodium = _sodium;
    let Key: Uint8Array;

    try {
      Key = Sodium.from_base64(
        (LZString.decompressFromBase64(KEY) || '').split('$|$')[0]
      );
    } catch (e) {
      return { status: 300, res: 'Error while decoding key' };
    }

    const Nonce = Sodium.randombytes_buf(
      Sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES
    );

    try {
      const EncRes = Sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        INPUT,
        null,
        null,
        Nonce,
        Key,
        'base64'
      );

      return {
        status: 200,
        res: LZString.compressToBase64(
          `${EncRes}$|$${Sodium.to_base64(Nonce)}`
        ),
      };
    } catch (e) {
      console.error('while chacha20 enc => ', e);

      return { status: 500, res: 'Error while encrypting input!' };
    }
  },
  Dec: async ({ KEY, INPUT }: { KEY: string; INPUT: string }) => {
    await _sodium.ready;
    const Sodium = _sodium;

    let Key: Uint8Array;

    try {
      Key = Sodium.from_base64(
        (LZString.decompressFromBase64(KEY) || '').split('$|$')[0]
      );
    } catch (e) {
      return { status: 300, res: 'Error while decoding key' };
    }

    let Nonce: Uint8Array;
    let Cipher: Uint8Array;

    try {
      Nonce = Sodium.from_base64(
        (LZString.decompressFromBase64(INPUT) || '').split('$|$')[1]
      );
      Cipher = Sodium.from_base64(
        (LZString.decompressFromBase64(INPUT) || '').split('$|$')[0]
      );
    } catch (error) {
      console.info(INPUT);

      return {
        status: 500,
        res: 'Looks like encrypted input has been tampered!',
      };
    }

    try {
      const DecRes = Sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        Cipher,
        null,
        Nonce,
        Key,
        'text'
      );

      return {
        status: 200,
        res: DecRes,
      };
    } catch (e: any) {
      console.error('while chacha20 dec => ', e);
      return { status: 300, res: 'Invalid Encryption key!' };
    }
  },
};
