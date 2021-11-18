import type { KeyType } from '../blockchain';

export interface KeyPair {
  readonly keyType: KeyType;
  readonly privateKey: Uint8Array;
  readonly publicKey: Uint8Array;
}

export interface EncodedKeyPair {
  readonly keyType: KeyType;
  readonly privateKey: string;
  readonly publicKey: string;
}
