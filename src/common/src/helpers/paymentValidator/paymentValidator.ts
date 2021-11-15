import type { Payment, UnsignedPayment } from '../../models/payment';
import { PaymentType } from '../../models/payment/paymentBase';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
import {
  validateTargetAddress, validateId, validateAmount, validateData, validatePaymentAsset,
  validateCreatedDate, validateExpiredDate, validateUrl
} from './validationMethods';

export class PaymentValidator extends PaymentValidatorBase<Payment | UnsignedPayment> {
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
    invalidAsset: 'Asset is invalid',
    invalidAssetAddress: 'Asset address is invalid',
    assetAddressIsNotContractAddress: 'Asset address isn\'t a contract address',
    assetAddressHasInvalidLength: 'Asset address has an invalid address',
    invalidAssetId: 'Asset Id is invalid',
    assetIdIsNegative: 'Asset Id is negative',
    assetIdIsNotInteger: 'Asset Id isn\'t an integer',
    invalidAssetDecimals: 'Asset number of decimals is invalid',
    assetDecimalsNumberIsNegative: 'Asset number of decimals is negative',
    assetDecimalsNumberIsNotInteger: 'Asset number of decimals isn\'t an integer',
    invalidSuccessUrl: 'Success URL is invalid',
    successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
    invalidCancelUrl: 'Cancel URL is invalid',
    cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol',
    invalidCreatedDate: 'Created date is invalid',
    invalidExpiredDate: 'Expired date is invalid',
    paymentLifetimeIsShort: 'Payment lifetime is short'
  } as const;
  static readonly minimumPaymentLifetime = 600000; // 10 * 60 * 1000;

  protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Payment | UnsignedPayment>> = [
    payment => payment.type !== PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined,
    payment => validateTargetAddress(payment.targetAddress, PaymentValidator.errors),
    payment => validateId(payment.id, PaymentValidator.errors),
    payment => validateAmount(payment.amount, PaymentValidator.errors),
    payment => validatePaymentAsset(payment.asset, PaymentValidator.errors),
    payment => validateData(payment.data, PaymentValidator.errors),
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
