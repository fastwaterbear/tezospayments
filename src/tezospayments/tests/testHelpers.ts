import { TezosPayments } from '../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tezosPaymentsErrors: (typeof TezosPayments)['errors'] = (TezosPayments as any).errors;
