import type { Donation, UnsignedDonation } from '../../models/payment';
import { PaymentType } from '../../models/payment/paymentBase';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
import { validateTargetAddress, validateDesiredAmount, validateDonationAsset, validateUrl, validateData } from './validationMethods';

export class DonationValidator extends PaymentValidatorBase<Donation | UnsignedDonation> {
  static readonly errors = {
    invalidDonationObject: 'Donation is undefined or not object',
    invalidType: 'Donation type is invalid',
    invalidData: 'Donation data is invalid',
    invalidAmount: 'Desired amount is invalid',
    amountIsNonPositive: 'Desired amount is less than or equal to zero',
    invalidTargetAddress: 'Target address is invalid',
    targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
    targetAddressHasInvalidLength: 'Target address has an invalid address',
    invalidAsset: 'Desired asset is invalid',
    invalidAssetAddress: 'Desired asset address is invalid',
    assetAddressIsNotContractAddress: 'Desired asset address isn\'t a contract address',
    assetAddressHasInvalidLength: 'Desired asset address has an invalid address',
    invalidAssetId: 'Asset Id is invalid',
    assetIdIsNegative: 'Asset Id is negative',
    assetIdIsNotInteger: 'Asset Id isn\'t an integer',
    invalidSuccessUrl: 'Success URL is invalid',
    successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
    invalidCancelUrl: 'Cancel URL is invalid',
    cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol'
  } as const;

  protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Donation | UnsignedDonation>> = [
    donation => donation.type !== PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined,
    donation => validateData(donation.data, DonationValidator.errors),
    donation => validateTargetAddress(donation.targetAddress, DonationValidator.errors),
    donation => validateDesiredAmount(donation.desiredAmount, DonationValidator.errors),
    donation => validateDonationAsset(donation.desiredAsset, DonationValidator.errors),
    donation => validateUrl(donation.successUrl, DonationValidator.successUrlErrors),
    donation => validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors)
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
