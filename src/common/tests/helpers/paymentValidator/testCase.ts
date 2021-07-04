import type { FailedValidationResults } from '../../../src/models/validation';

export type NegativeTestCase = readonly [payment: unknown, failedValidationResults: FailedValidationResults];
export type NegativeTestCases = readonly NegativeTestCase[];
