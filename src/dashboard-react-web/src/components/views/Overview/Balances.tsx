import React from 'react';

import { tezosMeta } from '../../../models/blockchain';
import { selectBalancesState } from '../../../store/balances/selectors';
import { getAcceptTezos, getAllAcceptedTokens } from '../../../store/services/selectors';
import { TokenList } from '../../common';
import { useAppSelector } from '../../hooks';

export const Balances = () => {
  const acceptTezos = useAppSelector(getAcceptTezos);
  const tokens = useAppSelector(getAllAcceptedTokens);
  const balances = useAppSelector(selectBalancesState);
  const items = [];

  if (acceptTezos) {
    items.push(<TokenList.Item key={tezosMeta.symbol} ticker={tezosMeta.symbol} name={tezosMeta.name} value={balances.tezos} iconSrc={tezosMeta.thumbnailUri} />);
  }

  tokens.forEach(t => {
    items.push(<TokenList.Item key={t.metadata?.symbol || 'unknown'} ticker={t.metadata?.symbol || 'unknown'} name={t.metadata?.name || 'unknown'} value={45.94} iconSrc={t.metadata?.thumbnailUri} />);
  });

  return <TokenList>
    {items}
  </TokenList>;
};

export const BalancesPure = React.memo(Balances);
