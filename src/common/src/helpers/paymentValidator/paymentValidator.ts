import type { Payment } from '../../models/payment';
import { PaymentType } from '../../models/payment/paymentBase';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
import {
  validateTargetAddress, validateId, validateAmount, validateData, validateAsset,
  validateCreatedDate, validateExpiredDate, validateUrl
} from './validationMethods';

export class PaymentValidator extends PaymentValidatorBase<Payment> {
  static readonly errors = {
    invalidPaymentObject: 'Payment is undefined or not object',
    invalidType: 'Payment type is invalid',
    invalidTargetAddress: 'Target address is invalid',
    targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
    targetAddressHasInvalidLength: 'Target address has an invalid address',
    invalidId: 'Id is invalid',
    emptyId: 'Id is empty',
    invalidAmount: 'Amount is invalid',
    amountIsNonPositive: 'Amount is less than or equal to zero',
    invalidData: 'Payment data is invalid',
    invalidPublicData: 'Payment public data is invalid',
    invalidPrivateData: 'Payment private data is invalid',
    publicDataShouldBeFlat: 'Public data should be flat',
    privateDataShouldBeFlat: 'Private data should be flat',
    invalidAsset: 'Asset address is invalid',
    assetIsNotContractAddress: 'Asset address isn\'t a contract address',
    assetHasInvalidLength: 'Asset address has an invalid address',
    invalidSuccessUrl: 'Success URL is invalid',
    successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
    invalidCancelUrl: 'Cancel URL is invalid',
    cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol',
    invalidCreatedDate: 'Created date is invalid',
    invalidExpiredDate: 'Expired date is invalid',
    paymentLifetimeIsShort: 'Payment lifetime is short'
  } as const;
  static readonly minimumPaymentLifetime = 600000; // 10 * 60 * 1000;

  protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Payment>> = [
    payment => payment.type !== PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined,
    payment => validateTargetAddress(payment.targetAddress, PaymentValidator.errors),
    payment => validateId(payment.id, PaymentValidator.errors),
    payment => validateAmount(payment.amount, PaymentValidator.errors),
    payment => validateData(payment.data, PaymentValidator.errors),
    payment => validateAsset(payment.asset, PaymentValidator.errors),
    payment => validateUrl(payment.successUrl, PaymentValidator.successUrlErrors),
    payment => validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors),
    payment => validateCreatedDate(payment.created, PaymentValidator.errors),
    payment => validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors),
  ];

  protected readonly invalidPaymentObjectError = PaymentValidator.errors.invalidPaymentObject;

  private static readonly successUrlErrors = {
    invalidUrl: PaymentValidator.errors.invalidSuccessUrl,
    invalidProtocol: PaymentValidator.errors.successUrlHasInvalidProtocol
  };

  private static readonly cancelUrlErrors = {
    invalidUrl: PaymentValidator.errors.invalidCancelUrl,
    invalidProtocol: PaymentValidator.errors.cancelUrlHasInvalidProtocol
  };
}
