import { BigNumber } from '@tezos-payments/common/dist/models/core';
import { ServiceOperationType } from '@tezos-payments/common/dist/models/service';

interface OperationAccount {
  readonly address: string;
}

interface OperationParameterBase {
  readonly entrypoint: string;
}

interface SendPaymentParameter extends OperationParameterBase {
  readonly entrypoint: 'send_payment',
  readonly value: {
    readonly payload: {
      readonly public: string;
      readonly operation_type: ServiceOperationType;
      readonly asset_value: null;
    }
  }
}

export interface Operation {
  readonly id: number;
  readonly hash: string;
  readonly type: 'endorsement' | 'ballot' | 'proposal' | 'activation' | 'double_baking' | 'double_endorsing'
  | 'nonce_revelation' | 'delegation' | 'origination' | 'transaction' | 'reveal'
  | 'migration' | 'revelation_penalty' | 'baking';
  readonly status: 'applied' | 'failed' | 'backtracked' | 'skipped';
  readonly timestamp: string;
  readonly sender: OperationAccount;
  readonly target: OperationAccount;
  readonly amount: BigNumber;
  readonly parameter: SendPaymentParameter;
}

export interface OperationWithDate extends Operation {
  readonly date: Date;
}
