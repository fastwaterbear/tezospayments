import { InMemorySigner } from '@taquito/signer';

import { TezosPayments } from '../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tezosPaymentsErrors: (typeof TezosPayments)['errors'] = (TezosPayments as any).errors;

const testPrivateKey = 'edskReuKVn9gfiboVjbcPkNnhLiyyFLDAwB3CHemb43zpKG3MpBf2CvwDNML2FitCP8fvdLXi4jdDVR1PHB4V9D8BWoYB4SQCU';
const testInMemorySigner = new InMemorySigner(testPrivateKey);
export const testWalletSigner = {
  privateKey: testPrivateKey,
  sign: (dataBytes: string): Promise<string> => testInMemorySigner.sign(dataBytes).then(signedData => signedData.prefixSig)
};
