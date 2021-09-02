import { Payment, Donation, getEncodedPaymentUrlType, PaymentUrlType } from '@tezospayments/common';

import { ServiceResult } from '../../serviceResult';
import { errors, LocalPaymentServiceError } from '../errors';
import { RawPaymentInfo } from '../urlRawPaymentInfoParser';
import { PaymentProvider } from './paymentProvider';

const encodedBase64PaymentUrlType = getEncodedPaymentUrlType(PaymentUrlType.Base64);
export class SerializedPaymentBase64Provider implements PaymentProvider {
  isMatch(_rawPaymentInfo: RawPaymentInfo): boolean {
    return true;
  }

  getPayment(
    rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'payment'; }
  ): ServiceResult<Payment | Promise<Payment>, LocalPaymentServiceError> {
    const isLegacy = !rawPaymentInfo.serializedPayment.startsWith(encodedBase64PaymentUrlType);
    const serializedPayment = isLegacy ? rawPaymentInfo.serializedPayment : rawPaymentInfo.serializedPayment.substr(2);

    const payment = Payment.deserialize(
      serializedPayment,
      {
        targetAddress: rawPaymentInfo.targetAddress,
      },
      isLegacy
    );

    return payment && Payment.validate(payment) === undefined
      ? payment
      : { isServiceError: true, error: errors.invalidPayment };
  }

  getDonation(
    rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'donation'; }
  ): ServiceResult<Donation | Promise<Donation>, LocalPaymentServiceError> {
    const isLegacy = !!rawPaymentInfo.serializedPayment && !rawPaymentInfo.serializedPayment.startsWith(encodedBase64PaymentUrlType);
    const serializedDonation = (isLegacy ? rawPaymentInfo.serializedPayment : rawPaymentInfo.serializedPayment?.substr(2)) || '';

    const donation = Donation.deserialize(
      serializedDonation,
      {
        targetAddress: rawPaymentInfo.targetAddress
      },
      isLegacy
    );

    return donation && Donation.validate(donation) === undefined
      ? donation
      : { isServiceError: true, error: errors.invalidDonation };
  }
}
