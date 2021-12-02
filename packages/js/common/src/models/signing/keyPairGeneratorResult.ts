import type { KeyPair, EncodedKeyPair } from './keyPair';

export interface KeyPairGeneratorResult {
  readonly raw: KeyPair;
  readonly encoded: EncodedKeyPair;
}
