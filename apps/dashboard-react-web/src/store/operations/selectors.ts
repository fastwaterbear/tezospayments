import BigNumber from 'bignumber.js';
import { createCachedSelector } from 're-reselect';

import { OperationDirection, OperationStatus, tezosMeta, unknownAssetMeta } from '@tezospayments/common';

import { ChartOperationType, Period } from '../../models/system';
import { AppState } from '../index';
import { selectAllAcceptedTokens } from '../services/selectors';

export const selectOperationsState = (state: AppState) => state.operationsState;

export const selectSortedOperations = createCachedSelector(
  selectOperationsState,
  (_state: AppState, type: ChartOperationType) => type,
  (operationsState, type) => {
    const filteredOperations = type !== 'all'
      ? operationsState.operations.filter(o => o.type === type)
      : [...operationsState.operations];

    filteredOperations.sort((a, b) => +b.date - +a.date);

    return filteredOperations;
  }
)(
  (_state, type) => type
);

export const selectSortedOperationsForPeriod = createCachedSelector(
  selectOperationsState,
  (_state: AppState, type: ChartOperationType) => type,
  (_state: AppState, _type: ChartOperationType, period: Period) => period,
  (operationsState, type, period) => {
    let filteredOperations = type !== 'all'
      ? operationsState.operations.filter(o => o.type === type)
      : [...operationsState.operations];

    if (period !== Period.All) {
      const startDate = getStartDate(period);
      filteredOperations = filteredOperations.filter(o => o.date.getTime() >= startDate.getTime());
    }
    filteredOperations.sort((a, b) => +b.date - +a.date);

    return filteredOperations;
  }
)(
  (_state, type, period) => `${type}:${period}`
);

const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

const toFixedNumber = (value: number, fractionDigits: number) => Number(Number(value).toFixed(fractionDigits));

const getDateKey = (date: Date) => getDate(date).toLocaleDateString('en-US');

function initializeChartData<T>(startDate: Date, endDate: Date, initItem: () => T) {
  const result = {} as { [key: string]: T };
  while (startDate.getTime() <= endDate.getTime()) {
    result[getDateKey(endDate)] = initItem();
    endDate.setDate(endDate.getDate() - 1);
  }
  return result;
}

export const selectProfitChartData = createCachedSelector(
  selectSortedOperationsForPeriod,
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

    Object.values(profitByDay).forEach(dayData => {
      (Object.entries(dayData) as Array<[keyof typeof dayData, number]>).forEach(([metricName, metricDayData]) => {
        dayData[metricName] = toFixedNumber(metricDayData, 2);
      });
    });

    const result = Object.entries(profitByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }))
      .reverse();

    return result;
  }
)(
  (_state, operationType, period) => `${operationType}:${period}`
);

export const selectOperationsCountByTokensChartData = createCachedSelector(
  selectSortedOperationsForPeriod,
  selectAllAcceptedTokens,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (operations, tokens, _operationType, period) => {
    const tokensMap = new Map(tokens.map(t => [t.contractAddress, t]));
    const startDate = period === Period.All ? operations[operations.length - 1]?.date || getTodayDate() : getStartDate(period);
    const endDate = getTodayDate();
    const initialDayItem: { [key: string]: number } = {};
    initialDayItem[tezosMeta.symbol] = 0;
    tokens.forEach(t => initialDayItem[(t.metadata || unknownAssetMeta).symbol] = 0);

    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const operationsCountByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success) {
        const key = getDateKey(operation.date);
        const dayData = (map[key] || (map[key] = { ...initialDayItem }));
        const assetKey = operation.asset ?
          (tokensMap.get(operation.asset)?.metadata || unknownAssetMeta).symbol
          : tezosMeta.symbol;
        dayData[assetKey] = (dayData[assetKey] || 0) + 1;
      }
      return map;
    }, initialData);

    const result = Object.entries(operationsCountByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }));
    result.reverse();

    return result;
  }
)(
  (_state, operationType, period) => `${operationType}:${period}`
);

export const selectOperationsCountByTypesChartData = createCachedSelector(
  selectSortedOperationsForPeriod,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (operations, _operationType, period) => {
    const startDate = period === Period.All ? operations[operations.length - 1]?.date || getTodayDate() : getStartDate(period);
    const endDate = getTodayDate();
    const initialDayItem = { incoming: 0, outgoing: 0, failed: 0 };
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const operationsCountByDay = operations.reduce((map, operation) => {
      const key = getDateKey(operation.date);
      const dayData = (map[key] || (map[key] = { ...initialDayItem }));
      if (operation.status === OperationStatus.Cancelled) {
        dayData.failed++;
      } else if (operation.status === OperationStatus.Success) {
        if (operation.direction === OperationDirection.Incoming) {
          dayData.incoming++;
        } else {
          dayData.outgoing++;
        }
      }
      return map;
    }, initialData);

    const result = Object.entries(operationsCountByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }));
    result.reverse();

    return result;
  }
)(
  (_state, operationType, period) => `${operationType}:${period}`
);

export const selectProfitByTokensChartData = createCachedSelector(
  selectSortedOperationsForPeriod,
  selectAllAcceptedTokens,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (_state: AppState, _operationType: ChartOperationType, _period: Period, direction: OperationDirection) => direction,
  (operations, tokens, _operationType, _period, direction) => {
    const tokensMap = new Map(tokens.map(t => [t.contractAddress, t]));
    const initialData = {} as { [key: string]: number };
    const profitByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success && operation.direction === direction) {
        const assetKey = operation.asset
          ? tokensMap.get(operation.asset)?.metadata?.symbol
          : tezosMeta.symbol;
        if (assetKey)
          map[assetKey] = (map[assetKey] || 0) + (operation.amount.toNumber() * getUsdRate(operation.asset));
      }
      return map;
    }, initialData);

    const result = Object.entries(profitByDay)
      .map(([token, value]) => ({ value: toFixedNumber(value, 2), name: token }));

    return result;
  }
)(
  (_state, operationType, period, direction) => `${operationType}:${period}:${direction}`
);

export const selectMaxTransactionChartData = createCachedSelector(
  selectSortedOperationsForPeriod,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (operations, _operationType, period) => {
    const startDate = period === Period.All ? operations[operations.length - 1]?.date || getTodayDate() : getStartDate(period);
    const endDate = getTodayDate();
    const initialDayItem = { max: 0 };
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const maxByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success && operation.direction === OperationDirection.Incoming) {
        const key = getDateKey(operation.date);
        const dayData = (map[key] || (map[key] = { ...initialDayItem }));
        const amount = operation.amount.toNumber();
        const usdRate = getUsdRate(operation.asset);
        dayData.max = Math.max(dayData.max, amount * usdRate);
      }
      return map;
    }, initialData);

    const result = Object.entries(maxByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }));
    result.reverse();

    return result;
  }
)(
  (_state, operationType, period) => `${operationType}:${period}`
);

export const selectNewSendersCountChartData = createCachedSelector(
  selectSortedOperations,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (operations, _operationType, period) => {
    operations = [...operations].reverse();
    const firstOperation = operations[0];
    const startDate = period === Period.All
      ? firstOperation ? getDate(firstOperation.date) : getTodayDate()
      : getStartDate(period);
    const endDate = getTodayDate();
    const initialDayItem = { newSendersCount: 0 };
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));

    const sendersSet = new Set<string>();
    const newSendersByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success && operation.direction === OperationDirection.Incoming && !sendersSet.has(operation.sender)) {
        sendersSet.add(operation.sender);
        const key = getDateKey(operation.date);
        const datData = map[key];
        if (datData !== undefined)
          datData.newSendersCount++;
      }
      return map;
    }, initialData);

    const result = Object.entries(newSendersByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }));
    result.reverse();

    return result;
  }
)(
  (_state, operationType, period) => `${operationType}:${period}`
);

export const selectTotalVolumeByTokens = createCachedSelector(
  selectSortedOperationsForPeriod,
  selectAllAcceptedTokens,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (_state: AppState, _operationType: ChartOperationType, _period: Period, direction: OperationDirection) => direction,
  (operations, tokens, _operationType, _period: Period, direction) => {
    const tokensMap = new Map(tokens.map(t => [t.contractAddress, t]));
    const result = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success && operation.direction === direction) {
        const assetKey = operation.asset ?
          (tokensMap.get(operation.asset)?.metadata || unknownAssetMeta).symbol
          : tezosMeta.symbol;

        map.set(assetKey, (map.get(assetKey) || new BigNumber(0)).plus(operation.amount));
      }
      return map;
    }, new Map<string, BigNumber>());

    return result;
  }
)(
  (_state, operationType, direction) => `${operationType}:${direction}`
);

