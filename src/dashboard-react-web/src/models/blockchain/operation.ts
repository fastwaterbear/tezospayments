export enum OperationType {
  PaymentIncome,
  DonationIncome,
  PaymentExpense,
  DonationExpense
}

export enum OperationStatus {
  Pending,
  Success,
  Cancelled
}

export enum PaymentType {
  Payment = 1,
  Donation = 2
}

interface OperationAccount {
  address: string;
}

interface OperationParameterBase {
  entrypoint: string;
}

interface SendPaymentParameter extends OperationParameterBase {
  entrypoint: 'send_payment',
  value: {
    payload: {
      public: string;
      operation_type: PaymentType;
      asset_value: null;
    }
  }
}

export interface Operation {
  id: number;
  hash: string;
  // eslint-disable-next-line max-len
  type: 'endorsement' | 'ballot' | 'proposal' | 'activation' | 'double_baking' | 'double_endorsing' | 'nonce_revelation' | 'delegation' | 'origination' | 'transaction' | 'reveal' | 'migration' | 'revelation_penalty' | 'baking';
  status: 'applied' | 'failed' | 'backtracked' | 'skipped';
  timestamp: string;
  sender: OperationAccount;
  target: OperationAccount;
  amount: number;
  parameter: SendPaymentParameter;
}

export interface OperationWithDate extends Operation {
  date: Date;
}
