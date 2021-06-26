import { createSelector } from 'reselect';

import { AppState } from '../index';

export const selectOperationsState = (state: AppState) => state.operationsState;

export const getSortedOperations = createSelector(
  selectOperationsState,
  operationsState => [...operationsState.operations].sort((a, b) => +a.date - +b.date)
);
