import { PaymentValidator } from '../../../src/helpers';
import { Payment } from '../../../src/models/payment';
import invalidAmountTestCases from './invalidAmountTestCases';
import invalidAssetTestCase from './invalidAssetTestCase';
import invalidDataTestCases from './invalidDataTestCases';
import invalidPaymentObjectTestCase from './invalidPaymentObjectTestCase';
import invalidTargetAddressTestCase from './invalidTargetAddressTestCase';
import { NegativeTestCases } from './testCase';

describe('Payment Validator', () => {
  let paymentValidator: PaymentValidator;

  beforeEach(() => {
    paymentValidator = new PaymentValidator();
  });

  const invalidPaymentTestCases: NegativeTestCases = invalidPaymentObjectTestCase
    .concat(invalidAmountTestCases)
    .concat(invalidTargetAddressTestCase)
    .concat(invalidDataTestCases)
    .concat(invalidAssetTestCase);

  test.each(invalidPaymentTestCases)(
    'payment validation when a payment is invalid. Fail on the first error [%p]',
    (payment, failedValidationResults) => {
      expect(paymentValidator.validate((payment as Payment))).toEqual(failedValidationResults);
    });
});
