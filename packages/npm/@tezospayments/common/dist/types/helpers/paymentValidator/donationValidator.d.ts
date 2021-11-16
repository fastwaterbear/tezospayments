import type { Donation, UnsignedDonation } from '../../models/payment';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
export declare class DonationValidator extends PaymentValidatorBase<Donation | UnsignedDonation> {
    static readonly errors: {
        readonly invalidDonationObject: "Donation is undefined or not object";
        readonly invalidType: "Donation type is invalid";
        readonly invalidData: "Donation data is invalid";
        readonly invalidAmount: "Desired amount is invalid";
        readonly amountIsNonPositive: "Desired amount is less than or equal to zero";
        readonly invalidTargetAddress: "Target address is invalid";
        readonly targetAddressIsNotNetworkAddress: "Target address isn't a network address";
        readonly targetAddressHasInvalidLength: "Target address has an invalid address";
        readonly invalidAsset: "Desired asset is invalid";
        readonly invalidAssetAddress: "Desired asset address is invalid";
        readonly assetAddressIsNotContractAddress: "Desired asset address isn't a contract address";
        readonly assetAddressHasInvalidLength: "Desired asset address has an invalid address";
        readonly invalidAssetId: "Asset Id is invalid";
        readonly assetIdIsNegative: "Asset Id is negative";
        readonly assetIdIsNotInteger: "Asset Id isn't an integer";
        readonly invalidSuccessUrl: "Success URL is invalid";
        readonly successUrlHasInvalidProtocol: "Success URL has an invalid protocol";
        readonly invalidCancelUrl: "Cancel URL is invalid";
        readonly cancelUrlHasInvalidProtocol: "Cancel URL has an invalid protocol";
    };
    protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Donation | UnsignedDonation>>;
    protected readonly invalidPaymentObjectError: "Donation is undefined or not object";
    private static readonly successUrlErrors;
    private static readonly cancelUrlErrors;
}
