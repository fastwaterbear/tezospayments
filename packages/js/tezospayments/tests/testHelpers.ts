import { InMemorySigner } from '@taquito/signer';

import { SigningType, TezosPaymentsOptions } from '../src';

const testPrivateKey = 'edskReuKVn9gfiboVjbcPkNnhLiyyFLDAwB3CHemb43zpKG3MpBf2CvwDNML2FitCP8fvdLXi4jdDVR1PHB4V9D8BWoYB4SQCU';
const testInMemorySigner = new InMemorySigner(testPrivateKey);
export const testWalletSigner = {
  privateKey: testPrivateKey,
  sign: (dataBytes: string): Promise<string> => testInMemorySigner.sign(dataBytes).then(signedData => signedData.prefixSig)
};

export const getSigningType = (signingOptions: TezosPaymentsOptions['signing']): SigningType => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (signingOptions as any)?.apiSecretKey === 'string')
    return SigningType.ApiSecretKey;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (signingOptions as any)?.walletSigning === 'function')
    return SigningType.Wallet;

  if (typeof signingOptions === 'function')
    return SigningType.Custom;

  throw new Error('Unknown signing type');
};
