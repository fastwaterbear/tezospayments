import { useState, useEffect } from 'react';

import { Ed25519KeyGenerator, EncodedKeyPair, KeyType } from '@tezospayments/common';

interface KeyPairGenerators {
  readonly ed25519: Ed25519KeyGenerator;
}

interface GenerateKeyPair {
  (keyType: KeyType): EncodedKeyPair;
}

type HookState = false | GenerateKeyPair;

const keyPairGenerators: KeyPairGenerators = {
  ed25519: new Ed25519KeyGenerator()
};

const loadKeyPairGenerators = () => keyPairGenerators.ed25519.initialize();

const areGeneratorsInitialized = () => keyPairGenerators.ed25519.isInitialized;

const generate: GenerateKeyPair = keyType => {
  switch (keyType) {
    case KeyType.Ed25519:
      return keyPairGenerators.ed25519.generate().encoded;
    case KeyType.Secp256k1:
      return {
        keyType: KeyType.Secp256k1,
        privateKey: 'spsk1VyxSVYfX3CfNpSNDxBdR97LnAdQA59jWpc4HYXtYg1cX53V6Y',
        publicKey: 'sppk7cjayJkatAA6Kzd9w6DSRrRDq6JoRAfugi1fqahpyjCBRCLGfob',
      };
    case KeyType.P256:
      return {
        keyType: KeyType.P256,
        publicKey: 'p2pk65H621C6fgfcuhiUcQmx3GRz8iNxjzMB1BG2WQKAYKEcbVzyJMD',
        privateKey: 'p2sk2yHAwhsLaRCm8zAfN4K1Py7fBhxgR1kAB5SCYn9yGWofkjqNTN',
      };

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
