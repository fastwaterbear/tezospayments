import { PaymentValidator } from '../../../src/helpers';
import { Payment } from '../../../src/models/payment';
import invalidAmountTestCases from './invalidAmountTestCases';
import invalidPaymentObjectTestCase from './invalidPaymentObjectTestCase';
import { NegativeTestCases } from './testCase';

describe('Payment Validator', () => {
  let paymentValidator: PaymentValidator;

  beforeEach(() => {
    paymentValidator = new PaymentValidator();
  });

  const invalidPaymentTestCases: NegativeTestCases = invalidPaymentObjectTestCase
    .concat(invalidAmountTestCases);


  test.each(invalidPaymentTestCases)(
    'payment validation when a payment is invalid. Fail on the first error [%p]',
    (payment, failedValidationResults) => {
      expect(paymentValidator.validate((payment as Payment))).toEqual(failedValidationResults);
    });
});
