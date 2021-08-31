import { Payment, PaymentCreateParameters, TezosPaymentsOptions } from '../../../src';

export type PositiveTestCase = readonly [
  message: string,
  tezosPaymentsOptions: TezosPaymentsOptions,
  paymentCreateParameters: PaymentCreateParameters,
  expectedPayment: Payment
];
export type PositiveTestCases = readonly PositiveTestCase[];

export type NegativeTestCase<
  InvalidPaymentCreateParametersSlice = unknown,
  InvalidTezosPaymentsOptionsSlice = unknown
  > = readonly [
    message: string,
    tezosPaymentsOptions: Omit<TezosPaymentsOptions, keyof InvalidTezosPaymentsOptionsSlice> & InvalidTezosPaymentsOptionsSlice,
    paymentCreateParameters: Omit<PaymentCreateParameters, keyof InvalidPaymentCreateParametersSlice> & InvalidPaymentCreateParametersSlice,
    expectedErrorType: (new (message?: string) => Error)
  ];
export type NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = ReadonlyArray<NegativeTestCase<InvalidTezosPaymentsOptionsSlice>>;
