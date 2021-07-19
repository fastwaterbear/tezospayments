import { Skeleton } from 'antd';
import React from 'react';

import { tezosMeta } from '@tezospayments/common/dist/models/blockchain';


import { selectBalancesState } from '../../../store/balances/selectors';
import { getAcceptTezos, getAllAcceptedTokens, selectServicesState } from '../../../store/services/selectors';
import { TokenList } from '../../common';
import { useAppSelector } from '../../hooks';

export const Balances = () => {
  const acceptTezos = useAppSelector(getAcceptTezos);
  const tokens = useAppSelector(getAllAcceptedTokens);
  const services = useAppSelector(selectServicesState);
  const balances = useAppSelector(selectBalancesState);

  if (!services.initialized || !balances.initialized) {
    return <Skeleton active />;
  }

  const items = [];

  if (acceptTezos) {
    items.push(<TokenList.Item
      key={tezosMeta.symbol}
      ticker={tezosMeta.symbol}
      name={tezosMeta.name}
      decimals={tezosMeta.decimals}
      value={balances.tezos}
      iconSrc={tezosMeta.thumbnailUri} />);
  }

  tokens.forEach(t => {
    items.push(<TokenList.Item
      key={t.metadata?.symbol}
      ticker={t.metadata?.symbol || 'unknown'}
      name={t.metadata?.name || 'unknown'}
      decimals={t.metadata ? t.metadata.decimals : 2}
      value={balances.tokens[t.contractAddress] || 0}
      iconSrc={t.metadata?.thumbnailUri} />);
  });

  return <TokenList>
    {items}
  </TokenList>;
};

export const BalancesPure = React.memo(Balances);
