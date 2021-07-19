import { DonationParser, NonIncludedDonationFields, DonationValidator } from '../../helpers';
import { PaymentBase, PaymentType } from './paymentBase';

export interface Donation extends PaymentBase {
  readonly type: PaymentType.Donation;
}

export class Donation extends PaymentBase {
  static readonly defaultParser: DonationParser = new DonationParser();
  static readonly defaultValidator: DonationValidator = new DonationValidator();

  static validate(donation: Donation) {
    return this.defaultValidator.validate(donation);
  }

  static parse(donationBase64: string, nonIncludedFields: NonIncludedDonationFields, parser = Donation.defaultParser): Donation | null {
    return parser.parse(donationBase64, nonIncludedFields);
  }
}

