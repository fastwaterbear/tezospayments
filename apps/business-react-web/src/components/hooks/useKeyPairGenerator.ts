import { useState, useEffect } from 'react';

import { Ed25519KeyGenerator, EncodedKeyPair, KeyType, EllipticCurveKeyGenerator } from '@tezospayments/common';

interface KeyPairGenerators {
  readonly ed25519: Ed25519KeyGenerator;
  readonly secp256k1: EllipticCurveKeyGenerator;
  readonly p256: EllipticCurveKeyGenerator;
}

interface GenerateKeyPair {
  (keyType: KeyType): EncodedKeyPair;
}

type HookState = false | GenerateKeyPair;

const keyPairGenerators: KeyPairGenerators = {
  ed25519: new Ed25519KeyGenerator(),
  secp256k1: new EllipticCurveKeyGenerator('secp256k1'),
  p256: new EllipticCurveKeyGenerator('p256')
};

const loadKeyPairGenerators = () => keyPairGenerators.ed25519.initialize();

const areGeneratorsInitialized = () => keyPairGenerators.ed25519.isInitialized;

const generate: GenerateKeyPair = keyType => {
  switch (keyType) {
    case KeyType.Ed25519:
      return keyPairGenerators.ed25519.generate().encoded;
    case KeyType.Secp256k1:
      return keyPairGenerators.secp256k1.generate().encoded;
    case KeyType.P256:
      return keyPairGenerators.p256.generate().encoded;

    default:
      throw new Error('Unknown algorithm type');
  }
};

export const useKeyPairGenerator = (): HookState => {
  const [isLoaded, setIsLoaded] = useState(areGeneratorsInitialized());

  useEffect(() => {
    let isCanceled = false;
    if (!isLoaded)
      loadKeyPairGenerators().then(() => !isCanceled && setIsLoaded(true));

    return () => {
      isCanceled = true;
    };
  }, [isLoaded]);

  return isLoaded ? generate : false;
};
