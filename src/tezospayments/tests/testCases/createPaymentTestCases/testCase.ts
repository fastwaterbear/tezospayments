import { Payment, PaymentCreateParameters, TezosPaymentsOptions } from '../../../src';

export type PositiveTestCase = readonly [
  message: string,
  tezosPaymentsOptions: TezosPaymentsOptions,
  paymentCreateParameters: PaymentCreateParameters,
  expectedPayment: Payment
];
export type PositiveTestCases = readonly PositiveTestCase[];

export type NegativeTestCase<
  InvalidPaymentCreateParametersSlice = Record<string, never>,
  InvalidTezosPaymentsOptionsSlice = Record<string, never>
  > = readonly [
    message: string,
    tezosPaymentsOptions: Omit<TezosPaymentsOptions, keyof InvalidTezosPaymentsOptionsSlice> & InvalidTezosPaymentsOptionsSlice,
    paymentCreateParameters: Omit<PaymentCreateParameters, keyof InvalidPaymentCreateParametersSlice> & InvalidPaymentCreateParametersSlice,
    expectedErrors: readonly string[]
  ];
export type NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = ReadonlyArray<NegativeTestCase<InvalidTezosPaymentsOptionsSlice>>;
