import { createCachedSelector } from 're-reselect';

import { OperationDirection, OperationStatus, Token } from '@tezospayments/common';

import { ChartOperationType, Period } from '../../models/system';
import { AppState } from '../index';
import { selectAllAcceptedTokens } from '../services/selectors';

export const selectOperationsState = (state: AppState) => state.operationsState;

export const selectSortedOperations = createCachedSelector(
  selectOperationsState,
  (_state: AppState, type: ChartOperationType) => type,
  (_state: AppState, _type: ChartOperationType, period: Period) => period,
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
      throw new Error(`Unsupported Period ${period}`);
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

function initializeChartData<T>(startDate: Date, endDate: Date, initItem: () => T) {
  const result = {} as { [key: string]: T };
  while (startDate.getTime() <= endDate.getTime()) {
    result[getDateKey(endDate)] = initItem();
    endDate.setDate(endDate.getDate() - 1);
  }
  return result;
}

export const selectProfitChartData = createCachedSelector(
  selectSortedOperations,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (operations, _operationType, period) => {
    const startDate = period === Period.All ? operations[operations.length - 1]?.date || getTodayDate() : getStartDate(period);
    const endDate = getTodayDate();
    const initialDayItem = { profit: 0, volume: 0, incoming: 0, outgoing: 0 };
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const profitByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success) {
        const key = getDateKey(operation.date);
        const dayData = (map[key] || (map[key] = { ...initialDayItem }));
        const amount = operation.amount.toNumber();
        const isOutgoing = operation.direction === OperationDirection.Outgoing;
        const usdRate = getUsdRate(operation.asset);
        dayData.profit += amount * (isOutgoing ? -1 : 1) * usdRate;
        dayData.volume += amount * (isOutgoing ? 1 : 1) * usdRate;
        dayData.incoming += amount * (isOutgoing ? 0 : 1) * usdRate;
        dayData.outgoing += amount * (isOutgoing ? 1 : 0) * usdRate;
      }
      return map;
    }, initialData);

    const result = Object.entries(profitByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }));
    result.reverse();

    return result;
  }
)(
  (_state, operationType, period, chartType) => `${operationType}:${period}:${chartType}`
);

const getOperationCountInitialDayItem = (tokens: Token[]) => {
  return tokens.reduce((obj, token) => {
    obj[token.contractAddress] = 0;
    return obj;
  }, { xtz: 0 } as { [key: string]: number });
};

export const selectOperationsCountChartData = createCachedSelector(
  selectSortedOperations,
  selectAllAcceptedTokens,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (operations, tokens, _operationType, period) => {
    const startDate = period === Period.All ? operations[operations.length - 1]?.date || getTodayDate() : getStartDate(period);
    const endDate = getTodayDate();
    const initialDayItem = getOperationCountInitialDayItem(tokens);
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const profitByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success) {
        const key = getDateKey(operation.date);
        const dayData = (map[key] || (map[key] = { ...initialDayItem }));
        const assetKey = operation.asset || 'xtz';
        dayData[assetKey] = (dayData[assetKey] || 0) + 1;
      }
      return map;
    }, initialData);

    const result = Object.entries(profitByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }));
    result.reverse();

    return result;
  }
)(
  (_state, operationType, period) => `${operationType}:${period}`
);
