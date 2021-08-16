import { errors } from './errors';

type OperationTypeName = 'payment' | 'donation';

interface RawPaymentInfoBase {
  readonly targetAddress: string;
  readonly operationType: OperationTypeName;
  readonly networkName: string | null;
}

export type RawPaymentInfo = RawPaymentInfoBase &
  (
    | { readonly operationType: 'payment'; readonly serializedPayment: string; }
    | { readonly operationType: 'donation'; readonly serializedPayment?: string; }
  );

type Segments = readonly [
  targetAddress: string,
  operationType: OperationTypeName
];

export class UrlRawPaymentInfoParser {
  parse(url: URL | Location): RawPaymentInfo | string {
    const segmentsResult = this.parseSegments(url.pathname);
    if (typeof segmentsResult === 'string')
      return segmentsResult;

    const [targetAddress, operationType] = segmentsResult;

    const isPaymentType = operationType === 'payment';
    const serializedPaymentOrDonation: string | undefined = url.hash.slice(1);
    if (!serializedPaymentOrDonation && isPaymentType)
      return errors.invalidUrl;

    const networkName = new URLSearchParams(url.search).get('network');

    return {
      targetAddress,
      operationType,
      networkName,
      serializedPayment: serializedPaymentOrDonation,
    };
  }

  private parseSegments(pathname: string): Segments | string {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length !== 2
      || !segments[0]
      || (segments[1] !== 'payment' && segments[1] !== 'donation'))
      return errors.invalidUrl;

    return segments as unknown as Segments;
  }
}
