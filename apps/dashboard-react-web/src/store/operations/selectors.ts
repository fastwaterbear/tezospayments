import { createCachedSelector } from 're-reselect';

import { OperationDirection, OperationStatus, OperationType } from '@tezospayments/common';

import { Period } from '../../models/system';
import { AppState } from '../index';

export type OperationTypeOrAll = OperationType | 'all';

export const selectOperationsState = (state: AppState) => state.operationsState;

export const selectSortedOperations = createCachedSelector(
  selectOperationsState,
  (_state: AppState, type: OperationTypeOrAll) => type,
  (_state: AppState, _type: OperationTypeOrAll, period: Period) => period,
  (operationsState, type, period) => {
    let filteredOperations = [...operationsState.operations];
    if (type !== 'all') {
      filteredOperations = filteredOperations.filter(o => o.type === type);
    }
    if (period !== Period.All) {
      const startDate = getStartDate(period);
      filteredOperations = filteredOperations.filter(o => o.date.getTime() >= startDate.getTime());
    }
    filteredOperations.sort((a, b) => +b.date - +a.date);

    return filteredOperations;
  }
)(
  (_state, period, type) => `${type}:${period}`
);

const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getStartDate = (period: Period) => {
  const result = getTodayDate();
  switch (period) {
    case Period.LastWeek:
      result.setDate(result.getDate() - 7);
      break;
    case Period.LastMonth:
      result.setMonth(result.getMonth() - 1);
      break;
    case Period.LastYear:
      result.setFullYear(result.getFullYear() - 1);
      break;
    default:
      throw new Error(`Unsupported period ${period}`);
  }
  return result;
};

//todo mode to storage, load from external source
const getUsdRate = (asset: string | undefined) => {
  switch (asset) {
    case undefined:
      return 4.58;

    case 'KT19sYK89XKYTeGHekWK9wL5iDHVF4YYf26t':
      return 1;

    case 'KT1EKo1Eihucz9N4cQyaDKeYRoMzTEoiZRAT':
      return 0.1;

    default:
      throw new Error(`Unsupported token ${asset}`);
  }
};

const getDateKey = (date: Date) => date.toLocaleDateString('en-US');

const getEmptyData = (startDate: Date, endDate: Date) => {
  const result = {} as { [key: string]: number };
  while (startDate.getTime() <= endDate.getTime()) {
    result[getDateKey(endDate)] = 0;
    endDate.setDate(endDate.getDate() - 1);
  }

  return result;
};

export const selectProfitChartData = createCachedSelector(
  selectSortedOperations,
  (_state: AppState, type: OperationTypeOrAll) => type,
  (_state: AppState, _type: OperationTypeOrAll, period: Period) => period,
  (_state: AppState, _type: OperationTypeOrAll, _period: Period, ignoreOutgoing: boolean) => ignoreOutgoing,
  (operations, _type, period, ignoreOutgoing) => {
    const startDate = period === Period.All ? operations[operations.length - 1]?.date || getTodayDate() : getStartDate(period);
    const endDate = getTodayDate();
    const initialData = getEmptyData(startDate, endDate);
    const profitByDay = operations.reduce((p, o) => {
      if (o.status === OperationStatus.Success) {
        const key = getDateKey(o.date);
        const multiplier = o.direction === OperationDirection.Outgoing
          ? ignoreOutgoing ? 0 : -1
          : 1;
        p[key] = (p[key] || 0) + o.amount.toNumber() * multiplier * getUsdRate(o.asset);
      }
      return p;
    }, initialData);

    const result = Object.entries(profitByDay)
      .map(([dayStr, value]) => [new Date(dayStr).toLocaleDateString('en-US'), value]) as Array<[string, number | string]>;
    result.push(['Day', 'USD']);
    result.reverse();

    return result;
  }
)(
  (_state, period, type, ignoreOutgoing) => `${type}:${period}:${ignoreOutgoing}`
);
