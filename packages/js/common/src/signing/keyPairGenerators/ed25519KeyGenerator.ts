import { b58cencode, prefix } from '@taquito/utils';
import sodium from 'libsodium-wrappers';

import { EncodedKeyPair, KeyPair, KeyPairGeneratorResult, KeyType } from '../../models';
import type { KeyPairGenerator } from './keyPairGenerator';

export class Ed25519KeyGenerator implements KeyPairGenerator {
  private _isInitialized = false;

  get isInitialized() {
    return this._isInitialized;
  }

  generate(): KeyPairGeneratorResult {
    if (!this.isInitialized)
      throw new Error('Ed25519 key generator is not initialized');

    const keyPair = sodium.crypto_sign_keypair('uint8array');
    const raw: KeyPair = {
      keyType: KeyType.Ed25519,
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    };

    const encoded: EncodedKeyPair = {
      keyType: KeyType.Ed25519,
      privateKey: b58cencode(raw.privateKey, prefix['edsk']),
      publicKey: b58cencode(raw.publicKey, prefix['edpk']),
    };

    return {
      raw,
      encoded
    };
  }

  async initialize(): Promise<void> {
    await sodium.ready;
    this._isInitialized = true;
  }

  static async create(): Promise<Ed25519KeyGenerator> {
    const instance = new Ed25519KeyGenerator();
    await instance.initialize();

    return instance;
  }
}
