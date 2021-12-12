import { createSelector } from 'reselect';

import { optimization, Token, tokenWhitelistMap } from '@tezospayments/common';

import { selectAccountsState } from '../accounts/selectors';
import { AppState } from '../index';
import { PendingOperation } from './slice';

export const selectTokensState = createSelector(
  selectAccountsState,
  accountsState => {
    const network = accountsState.currentAccount?.network;
    return (network && tokenWhitelistMap.get(network)) || optimization.emptyMap as Map<string, Token>;
  }
);

export const selectServicesState = (state: AppState) => state.servicesState;
export const selectAllAcceptedTokens = createSelector(
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

export const selectAcceptTezos = createSelector(
  selectServicesState,
  servicesState => {
    return servicesState.services.some(s => s.allowedTokens.tez);
  }
);

export const selectSortedServices = createSelector(
  selectServicesState,
  servicesState => {
    return [...servicesState.services].sort((a, b) => a.name.localeCompare(b.name));
  }
);

export const selectOperationsByService = createSelector(
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
