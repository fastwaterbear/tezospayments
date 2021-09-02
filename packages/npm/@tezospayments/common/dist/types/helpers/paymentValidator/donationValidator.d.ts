import type { Donation } from '../../models/payment';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
export declare class DonationValidator extends PaymentValidatorBase<Donation> {
    static readonly errors: {
        readonly invalidDonationObject: "Donation is undefined or not object";
        readonly invalidType: "Donation type is invalid";
        readonly invalidAmount: "Desired amount is invalid";
        readonly amountIsNonPositive: "Desired amount is less than or equal to zero";
        readonly invalidTargetAddress: "Target address is invalid";
        readonly targetAddressIsNotNetworkAddress: "Target address isn't a network address";
        readonly targetAddressHasInvalidLength: "Target address has an invalid address";
        readonly invalidAsset: "Desired asset address is invalid";
        readonly assetIsNotContractAddress: "Desired asset address isn't a contract address";
        readonly assetHasInvalidLength: "Desired asset address has an invalid address";
        readonly invalidSuccessUrl: "Success URL is invalid";
        readonly successUrlHasInvalidProtocol: "Success URL has an invalid protocol";
        readonly invalidCancelUrl: "Cancel URL is invalid";
        readonly cancelUrlHasInvalidProtocol: "Cancel URL has an invalid protocol";
    };
    protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Donation>>;
    protected readonly invalidPaymentObjectError: "Donation is undefined or not object";
    private static readonly successUrlErrors;
    private static readonly cancelUrlErrors;
}
