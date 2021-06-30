// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SuccessfulServiceResult<TData> = TData extends Record<string, any>
  ? TData & { readonly isServiceError?: void }
  : TData;

export interface FailedServiceResult<TError extends Error | string = string> {
  readonly isServiceError: true;
  readonly error: TError;
}

export type ServiceResult<TData = undefined, TError extends Error | string = string> =
  | SuccessfulServiceResult<TData>
  | FailedServiceResult<TError>;
