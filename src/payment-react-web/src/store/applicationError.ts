import { Action, AnyAction, createAction, createReducer } from '@reduxjs/toolkit';

import type { ApplicationError } from '../models/system';

export const handleError = createAction<Error>('handleError');
export const clearError = createAction('clearError');

interface RejectedErrorAction extends Action {
  readonly payload: Error;
  readonly error: {
    readonly message: 'Rejected'
  }
}

type ErrorAction =
  | Action & { readonly error: ApplicationError; }
  | RejectedErrorAction;

const isErrorAction = (action: AnyAction): action is ErrorAction => {
  return action.type === handleError.type || action.type.endsWith('rejected');
};

const isRejectErrorAction = (action: AnyAction): action is RejectedErrorAction => {
  return action.error?.message === 'Rejected';
};

const initialState: ApplicationError | null = null;
export const applicationErrorReducer = createReducer(
  (initialState as ApplicationError | null),
  builder => builder
    .addCase(clearError, () => null)
    .addMatcher(
      isErrorAction,
      (_state, action) => isRejectErrorAction(action)
        ? { ...action.payload }
        : { ...action.error }
    )
);

export const actions = {
  handleError,
  clearError
};
