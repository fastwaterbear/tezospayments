import { errors } from './errors';

export type RawPaymentInfo =
  | {
    readonly operationType: 'payment';
    readonly serializedPayment: string;
  }
  | {
    readonly targetAddress: string;
    readonly operationType: 'donation';
    readonly serializedDonation?: string;
  };

export class UrlRawPaymentInfoParser {
  parse(url: URL | Location): RawPaymentInfo | string {
    const isPaymentType = url.pathname === '/';
    const serializedPaymentOrDonation: string | undefined = url.hash.slice(1);
    if (!serializedPaymentOrDonation && isPaymentType)
      return errors.invalidUrl;

    if (isPaymentType) {
      return {
        operationType: 'payment',
        serializedPayment: serializedPaymentOrDonation
      };
    }

    const targetDonationAddress = this.parseTargetDonationAddress(url.pathname);
    if (!targetDonationAddress)
      return errors.invalidUrl;

    return {
      operationType: 'donation',
      targetAddress: targetDonationAddress,
      serializedDonation: serializedPaymentOrDonation,
    };
  }

  private parseTargetDonationAddress(pathname: string): string | null {
    const segments = pathname.split('/').filter(Boolean);

    return (segments.length === 2 && segments[0] && segments[1] === 'donation')
      ? segments[0]
      : null;
  }
}
