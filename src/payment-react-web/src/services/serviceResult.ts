// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SuccessfulServiceResult<TData> = TData & { readonly isServiceError?: void };

export interface FailedServiceResult<TError extends Error | string = string> {
  readonly isServiceError: true;
  readonly error: TError;
}

export type ServiceResult<TData = undefined, TError extends Error | string = string> =
  | SuccessfulServiceResult<TData>
  | FailedServiceResult<TError>;
