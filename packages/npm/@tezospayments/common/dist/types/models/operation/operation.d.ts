import BigNumber from 'bignumber.js';
import type { OperationDirection } from './operationDirection';
import type { OperationStatus } from './operationStatus';
import type { OperationType } from './operationType';
export interface Operation {
    readonly hash: string;
    readonly type: OperationType;
    readonly direction: OperationDirection;
    readonly status: OperationStatus;
    readonly amount: BigNumber;
    readonly asset?: string;
    readonly timestamp: string;
    readonly date: Date;
    readonly sender: string;
    readonly target: string;
}
