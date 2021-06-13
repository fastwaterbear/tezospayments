import React from 'react';

import { TEZOS_META } from '../../../models/blockchain';
import { getAcceptTezos, getAllAcceptedTokens } from '../../../store/services/selectors';
import { TokenList } from '../../common';
import { useAppSelector } from '../../hooks';

export const Balances = () => {
  const acceptTezos = useAppSelector(getAcceptTezos);
  const tokens = useAppSelector(getAllAcceptedTokens);
  const items = [];

  if (acceptTezos) {
    items.push(<TokenList.Item ticker={TEZOS_META.symbol} name={TEZOS_META.name} value={45.94} iconSrc={TEZOS_META.thumbnailUri} />);
  }

  tokens.forEach(t => {
    items.push(<TokenList.Item ticker={t.metadata?.symbol || 'unknown'} name={t.metadata?.name|| 'unknown'} value={45.94} iconSrc={t.metadata?.thumbnailUri} />);
  });

  return <TokenList>
    {items}
  </TokenList>;
};

export const BalancesPure = React.memo(Balances);
