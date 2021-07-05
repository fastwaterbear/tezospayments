import { PaymentValidator } from '../../../src/helpers';
import { Payment } from '../../../src/models/payment';
import invalidAmountTestCases from './invalidAmountTestCases';
import invalidAssetTestCases from './invalidAssetTestCases';
import invalidDataTestCases from './invalidDataTestCases';
import invalidPaymentObjectTestCases from './invalidPaymentObjectTestCases';
import invalidTargetAddressTestCases from './invalidTargetAddressTestCases';
import { NegativeTestCases } from './testCase';

describe('Payment Validator', () => {
  let paymentValidator: PaymentValidator;

  beforeEach(() => {
    paymentValidator = new PaymentValidator();
  });

  const invalidPaymentTestCases: NegativeTestCases = invalidPaymentObjectTestCases
    .concat(invalidAmountTestCases)
    .concat(invalidTargetAddressTestCases)
    .concat(invalidDataTestCases)
    .concat(invalidAssetTestCases);

  test.each(invalidPaymentTestCases)(
    'payment validation when a payment is invalid. Fail on the first error [%p]',
    (payment, failedValidationResults) => {
      expect(paymentValidator.validate((payment as Payment))).toEqual(failedValidationResults);
    });
});
