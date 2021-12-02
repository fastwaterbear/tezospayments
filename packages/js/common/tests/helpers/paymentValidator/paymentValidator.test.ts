import { PaymentValidator } from '../../../src/helpers';
import { Payment } from '../../../src/models/payment';
import {
  invalidAmountTestCases, invalidAssetTestCases, invalidCancelUrlTestCases, invalidCreatedDateTestCases, invalidDataTestCases,
  invalidExpiredDateTestCases, invalidIdTestCases, invalidPaymentObjectTestCases, invalidSuccessUrlTestCases, invalidTargetAddressTestCases,
  invalidTypeTestCases, validPaymentTestCases
} from './paymentCases';
import { NegativeTestCases } from './testCase';

describe('Payment Validator', () => {
  let paymentValidator: PaymentValidator;

  beforeEach(() => {
    paymentValidator = new PaymentValidator();
  });

  test.each(validPaymentTestCases)('payment validation when a payment is valid [%p]', payment => {
    expect(paymentValidator.validate(payment)).toBeUndefined();
  });

  const invalidPaymentTestCases: NegativeTestCases = invalidPaymentObjectTestCases
    .concat(invalidTypeTestCases)
    .concat(invalidTargetAddressTestCases)
    .concat(invalidIdTestCases)
    .concat(invalidAmountTestCases)
    .concat(invalidDataTestCases)
    .concat(invalidAssetTestCases)
    .concat(invalidSuccessUrlTestCases)
    .concat(invalidCancelUrlTestCases)
    .concat(invalidCreatedDateTestCases)
    .concat(invalidExpiredDateTestCases);

  test.each(invalidPaymentTestCases)(
    'payment validation when a payment is invalid. Fail on the first error [%p]',
    (payment, failedValidationResults) => {
      expect(paymentValidator.validate((payment as Payment))).toEqual(failedValidationResults);
    });
});
