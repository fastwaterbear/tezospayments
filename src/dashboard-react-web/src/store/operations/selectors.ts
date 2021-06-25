import { createSelector } from 'reselect';

import { OperationWithDate } from '../../models/blockchain/operation';
import { AppState } from '../index';

export const selectOperationsState = (state: AppState) => state.operationsState;

export const getSortedOperations = createSelector(
  selectOperationsState,
  operationsState => {
    const operationsWithDate = operationsState.operations.map<OperationWithDate>(o => (
      { ...o, date: new Date(o.timestamp) }
    ));
    operationsWithDate.sort((a, b) => +a.date - +b.date);

    return operationsWithDate;
  }
);
