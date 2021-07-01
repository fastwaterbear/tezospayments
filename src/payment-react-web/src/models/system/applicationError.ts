export interface RegisteredApplicationError {
  readonly id: number;
}

export interface UnknownApplicationError {
  readonly message: string
  readonly source?: Error;
}

export type ApplicationError =
  | RegisteredApplicationError
  | UnknownApplicationError;

export const isRegisteredApplicationError = (error: ApplicationError): error is RegisteredApplicationError =>
  typeof (error as RegisteredApplicationError).id === 'number';
