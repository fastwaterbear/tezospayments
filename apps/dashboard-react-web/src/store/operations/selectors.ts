import BigNumber from 'bignumber.js';
import { createCachedSelector } from 're-reselect';

import { OperationDirection, OperationStatus, ServiceOperation, tezosMeta, unknownAssetMeta } from '@tezospayments/common';

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
      const startDate = getStartDateByDatePeriod(period);
      filteredOperations = filteredOperations.filter(o => o.date.getTime() >= startDate.getTime());
    }
    filteredOperations.sort((a, b) => +b.date - +a.date);

    return filteredOperations;
  }
)(
  (_state, type, period) => `${type}:${period}`
);

const getDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const getTodayDate = () => getDate(new Date());

const getStartDateByDatePeriod = (period: Exclude<Period, Period.All>) => {
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

const toFixedNumber = (value: number, fractionDigits: number) => {
  return Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
};

const getDateKey = (date: Date) => getDate(date).toLocaleDateString('en-US');

const initializeChartData = <T>(startDate: Date, endDate: Date, initItem: () => T) => {
  const result: { [key: string]: T } = {};
  const startDateTime = startDate.getTime();
  let endDateTime = endDate.getTime();

  while (startDateTime <= endDateTime) {
    result[getDateKey(endDate)] = initItem();

    endDateTime = endDate.getTime() - 86400000;
    endDate.setTime(endDateTime);
  }

  return result;
};

const getStartDate = (period: Period, operations: readonly ServiceOperation[]) => {
  return period === Period.All
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ? (operations[operations.length - 1] ? getDate(operations[operations.length - 1]!.date) : getTodayDate())
    : getStartDateByDatePeriod(period);
};

const getEndDate = (_period: Period, _operations: readonly ServiceOperation[]) => getTodayDate();

export const selectProfitChartData = createCachedSelector(
  selectSortedOperationsForPeriod,
  (_state: AppState, operationType: ChartOperationType) => operationType,
  (_state: AppState, _operationType: ChartOperationType, period: Period) => period,
  (operations, _operationType, period) => {
    const startDate = getStartDate(period, operations);
    const endDate = getEndDate(period, operations);
    const initialDayItem = { profit: 0, volume: 0, incoming: 0, outgoing: 0 };

    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const profitByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success) {
        const key = getDateKey(operation.date);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dayData = map[key]!;
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
    const startDate = getStartDate(period, operations);
    const endDate = getEndDate(period, operations);
    const tokensMap = new Map(tokens.map(t => [t.contractAddress, t]));
    const initialDayItem: { [key: string]: number } = {};
    initialDayItem[tezosMeta.symbol] = 0;
    tokens.forEach(t => initialDayItem[(t.metadata || unknownAssetMeta).symbol] = 0);

    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const operationsCountByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success) {
        const key = getDateKey(operation.date);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dayData = map[key]!;
        const assetKey = operation.asset ?
          (tokensMap.get(operation.asset)?.metadata || unknownAssetMeta).symbol
          : tezosMeta.symbol;
        dayData[assetKey] = (dayData[assetKey] || 0) + 1;
      }
      return map;
    }, initialData);

    const result = Object.entries(operationsCountByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }))
      .reverse();

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
    const startDate = getStartDate(period, operations);
    const endDate = getEndDate(period, operations);
    const initialDayItem = { incoming: 0, outgoing: 0, failed: 0 };
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const operationsCountByDay = operations.reduce((map, operation) => {
      const key = getDateKey(operation.date);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dayData = map[key]!;
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
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }))
      .reverse();

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
    const startDate = getStartDate(period, operations);
    const endDate = getEndDate(period, operations);
    const initialDayItem = { max: 0 };
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));
    const maxByDay = operations.reduce((map, operation) => {
      if (operation.status === OperationStatus.Success && operation.direction === OperationDirection.Incoming) {
        const key = getDateKey(operation.date);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dayData = map[key]!;
        const amount = operation.amount.toNumber();
        const usdRate = getUsdRate(operation.asset);
        dayData.max = Math.max(dayData.max, amount * usdRate);
      }
      return map;
    }, initialData);

    const result = Object.entries(maxByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }))
      .reverse();

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
    const startDate = getStartDate(period, operations);
    const endDate = getEndDate(period, operations);
    const initialDayItem = { newSendersCount: 0 };
    const initialData = initializeChartData(startDate, endDate, () => ({ ...initialDayItem }));

    const sendersSet = new Set<string>();
    const newSendersByDay = operations.reduceRight((map, operation) => {
      if (operation.status === OperationStatus.Success && operation.direction === OperationDirection.Incoming && !sendersSet.has(operation.sender)) {
        sendersSet.add(operation.sender);
        const key = getDateKey(operation.date);
        const datData = map[key];
        if (datData)
          datData.newSendersCount++;
      }
      return map;
    }, initialData);

    const result = Object.entries(newSendersByDay)
      .map(([dayStr, value]) => ({ day: new Date(dayStr).toLocaleDateString('en-US'), ...value }))
      .reverse();

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
