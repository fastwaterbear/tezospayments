import type { Payment } from './models';
import type { PaymentCreateParameters, TezosPaymentsOptions } from './options';
export declare class TezosPayments {
    constructor(options: TezosPaymentsOptions);
    createPayment(createParameters: PaymentCreateParameters): Promise<Payment>;
}
