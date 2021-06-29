import { networks } from '@tezos-payments/common/dist/models/blockchain';
import { Payment } from '@tezos-payments/common/dist/models/payment';
import { Service } from '@tezos-payments/common/dist/models/service';
import { memoize } from '@tezos-payments/common/dist/utils';

import { PaymentInfo } from '../../models/payment/paymentInfo';
import { ServiceResult } from '../serviceResult';
import { errors, LocalPaymentServiceError } from './errors';
import { ServiceProvider, TzStatsServiceProvider } from './serviceProvider';

type Segments = readonly [
  targetAddress: string,
  operationType: string
];

export class LocalPaymentService {
  readonly serviceProvider: ServiceProvider = new TzStatsServiceProvider(networks.edo2net);

  async getCurrentPaymentInfo(): Promise<ServiceResult<PaymentInfo, LocalPaymentServiceError>> {
    const paymentResult = this.getCurrentPayment();
    if (paymentResult.isServiceError)
      return paymentResult;

    const serviceResult = await this.getCurrentService();
    if (serviceResult.isServiceError)
      return serviceResult;

    return {
      payment: paymentResult,
      service: serviceResult,
    };
  }

  getCurrentPayment(): ServiceResult<Payment, LocalPaymentServiceError> {
    const currentLocation = window.location;

    const paymentBase64 = currentLocation.hash.slice(1);
    if (!paymentBase64)
      return { isServiceError: true, error: errors.invalidUrl };

    const segmentsResult = this.getSegments(currentLocation.pathname);
    if (segmentsResult.isServiceError)
      return segmentsResult;

    const payment = Payment.parse(paymentBase64, {
      targetAddress: segmentsResult[0],
      urls: [{ type: 'base64', url: new URL(window.location.href) }]
    });

    return payment && Payment.validate(payment)
      ? payment
      : { isServiceError: true, error: errors.invalidPayment };
  }

  async getCurrentService(): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    const currentLocation = window.location;
    const segmentsResult = this.getSegments(currentLocation.pathname);
    if (segmentsResult.isServiceError)
      return segmentsResult;

    return this.serviceProvider.getService(segmentsResult[0]);
  }

  private getSegments = memoize((pathname: string): ServiceResult<Segments, LocalPaymentServiceError> => {
    const segments = pathname.split('/').filter(Boolean) as readonly string[] as Segments;

    if (segments.length !== 2)
      return { isServiceError: true, error: errors.invalidUrl };

    return segments;
  });
}
