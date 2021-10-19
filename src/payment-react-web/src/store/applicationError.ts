import { createAction, createReducer, isRejected } from '@reduxjs/toolkit';

import type { ApplicationError } from '../models/system';

export const handleError = createAction<Error>('handleError');
export const clearError = createAction('clearError');

const initialState = null as ApplicationError | null;
export const applicationErrorReducer = createReducer(
  initialState,
  builder => builder
    .addCase(clearError, () => null)
    .addMatcher(
      isRejected,
      (_state, action) => action.meta.rejectedWithValue
        ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          message: action.payload && (action.payload as any).toString()
        }
        : {
          message: action.error.message || 'Application Error',
          source: action.error
        }
    )
);

export const actions = {
  handleError,
  clearError
};
