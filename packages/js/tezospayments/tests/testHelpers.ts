import { InMemorySigner } from '@taquito/signer';

import { SigningType, TezosPaymentsOptions } from '../src';

const testKey = {
  secret: 'edskReuKVn9gfiboVjbcPkNnhLiyyFLDAwB3CHemb43zpKG3MpBf2CvwDNML2FitCP8fvdLXi4jdDVR1PHB4V9D8BWoYB4SQCU',
  public: 'edpkuiqKqmz7WC25jURSEmCjQ4Xsiek9p2bFjVcTBqtmrPjMk1bTgc',
};

const testInMemorySigner = new InMemorySigner(testKey.secret);
export const testWalletSigner = {
  secretKey: testKey.secret,
  publicKey: testKey.public,
  sign: (dataBytes: string): Promise<string> => testInMemorySigner.sign(dataBytes).then(signedData => signedData.prefixSig)
};

export const getSigningType = (signingOptions: TezosPaymentsOptions['signing']): SigningType => {
  if ('apiSecretKey' in signingOptions && typeof signingOptions.apiSecretKey === 'string')
    return SigningType.ApiSecretKey;

  if ('wallet' in signingOptions && typeof signingOptions.wallet === 'object')
    return SigningType.Wallet;

  if ('custom' in signingOptions && typeof signingOptions.custom === 'object')
    return SigningType.Custom;

  throw new Error('Unknown signing type');
};
