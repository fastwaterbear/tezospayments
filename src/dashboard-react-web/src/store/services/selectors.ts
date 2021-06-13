import { createSelector } from 'reselect';

import { Token } from '../../models/blockchain';
import { AppState } from '../index';

export const selectServicesState = (state: AppState) => state.servicesState;
export const getAllAcceptedTokens = createSelector(
  selectServicesState,
  servicesState => {
    const result = new Set<Token>();
    servicesState.services.forEach(s => s.tokens.forEach(t => result.add(t)));

    return result;
  }
);

export const getAcceptTezos = createSelector(
  selectServicesState,
  servicesState => {
    return servicesState.services.some(s => s.acceptTezos);
  }
);
