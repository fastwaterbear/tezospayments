import { createSelector } from 'reselect';

import { Token, tokenWhitelistMap } from '@tezospayments/common';

import { AppState } from '../index';
import { PendingOperation } from './slice';

// TODO
export const selectTokensState = (_state: AppState) => tokenWhitelistMap;

export const selectServicesState = (state: AppState) => state.servicesState;
export const getAllAcceptedTokens = createSelector(
  selectServicesState,
  selectTokensState,
  (servicesState, tokensState) => {
    const result = new Set<Token>();

    servicesState.services.forEach(s => s.allowedTokens.assets
      .forEach(assetAddress => {
        const token = tokensState.get(assetAddress);
        if (!token)
          return;

        result.add(token);
      })
    );

    return [...result];
  }
);

export const getAcceptTezos = createSelector(
  selectServicesState,
  servicesState => {
    return servicesState.services.some(s => s.allowedTokens.tez);
  }
);

export const getSortedServices = createSelector(
  selectServicesState,
  servicesState => {
    return [...servicesState.services].sort((a, b) => a.name.localeCompare(b.name));
  }
);

export const getOperationsByService = createSelector(
  selectServicesState,
  servicesState => {
    const operationsMap = new Map<string, PendingOperation[]>();

    servicesState.pendingOperations.forEach(op => {
      const operations = operationsMap.get(op.serviceAddress);

      if (operations)
        operations.push(op);
      else
        operationsMap.set(op.serviceAddress, [op]);
    });

    return operationsMap;
  }
);
