import type { Payment } from './models';
import type { PaymentCreateParameters, TezosPaymentsOptions } from './options';

export class TezosPayments {
  constructor(options: TezosPaymentsOptions) {
    throw new Error('Not implemented.');
  }

  async createPayment(createParameters: PaymentCreateParameters): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
}
