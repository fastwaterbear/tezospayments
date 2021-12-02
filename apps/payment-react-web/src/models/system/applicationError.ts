import type { SerializedError } from '@reduxjs/toolkit';

import type { DeepReadonly } from '@tezospayments/common';

export interface RegisteredApplicationError {
  readonly id: number;
}

export interface UnknownApplicationError {
  readonly message: string;
  readonly source?: DeepReadonly<SerializedError>;
}

export type ApplicationError =
  | RegisteredApplicationError
  | UnknownApplicationError;

export const isRegisteredApplicationError = (error: ApplicationError): error is RegisteredApplicationError =>
  typeof (error as RegisteredApplicationError).id === 'number';
