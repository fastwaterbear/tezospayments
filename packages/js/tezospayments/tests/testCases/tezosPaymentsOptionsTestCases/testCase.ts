import { TezosPaymentsOptions } from '../../../src';

export type PositiveTestCase = readonly [message: string, tezosPaymentsOptions: TezosPaymentsOptions];
export type PositiveTestCases = readonly PositiveTestCase[];

export type NegativeTestCase<InvalidTezosPaymentsOptionsSlice = Record<string, never>> = readonly [
  message: string,
  tezosPaymentsOptions: Omit<TezosPaymentsOptions, keyof InvalidTezosPaymentsOptionsSlice> & InvalidTezosPaymentsOptionsSlice,
  expectedErrors: readonly string[]
];
export type NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = ReadonlyArray<NegativeTestCase<InvalidTezosPaymentsOptionsSlice>>;
