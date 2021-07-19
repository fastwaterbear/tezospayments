import type { Donation } from '../../models/payment';
import { PaymentType } from '../../models/payment/paymentBase';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
import {
  validateTargetAddress, validateAmount, validateAsset, validateCreatedDate, validateUrl
} from './validationMethods';

export class DonationValidator extends PaymentValidatorBase<Donation> {
  static readonly errors = {
    invalidDonationObject: 'Donation is undefined or not object',
    invalidType: 'Donation type is invalid',
    invalidAmount: 'Amount is invalid',
    amountIsNegative: 'Amount is less than zero',
    invalidTargetAddress: 'Target address is invalid',
    targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
    targetAddressHasInvalidLength: 'Target address has an invalid address',
    invalidAsset: 'Asset address is invalid',
    assetIsNotContractAddress: 'Asset address isn\'t a contract address',
    assetHasInvalidLength: 'Asset address has an invalid address',
    invalidSuccessUrl: 'Success URL is invalid',
    successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
    invalidCancelUrl: 'Cancel URL is invalid',
    cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol',
    invalidCreatedDate: 'Created date is invalid',
  } as const;

  protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Donation>> = [
    donation => donation.type !== PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined,
    donation => validateTargetAddress(donation.targetAddress, DonationValidator.errors),
    donation => validateAmount(donation.amount, DonationValidator.errors),
    donation => validateAsset(donation.asset, DonationValidator.errors),
    donation => validateUrl(donation.successUrl, DonationValidator.successUrlErrors),
    donation => validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors),
    donation => validateCreatedDate(donation.created, DonationValidator.errors),
  ];

  protected readonly invalidPaymentObjectError = DonationValidator.errors.invalidDonationObject;

  private static readonly successUrlErrors = {
    invalidUrl: DonationValidator.errors.invalidSuccessUrl,
    invalidProtocol: DonationValidator.errors.successUrlHasInvalidProtocol
  };

  private static readonly cancelUrlErrors = {
    invalidUrl: DonationValidator.errors.invalidCancelUrl,
    invalidProtocol: DonationValidator.errors.cancelUrlHasInvalidProtocol
  };
}
