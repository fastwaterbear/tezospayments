import { Operation } from './operation';
import { OperationType } from './operationType';
export interface PaymentOperation extends Operation {
    readonly type: OperationType.Payment;
    readonly paymentId: string;
}
