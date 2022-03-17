import { Skeleton } from 'antd';
import React from 'react';

import { optimization, tezosMeta } from '@tezospayments/common';

import { selectBalancesState } from '../../../../store/balances/selectors';
import { selectAcceptTezos, selectAllAcceptedTokens, selectServicesState } from '../../../../store/services/selectors';
import { TokenList } from '../../../common';
import { useAppSelector } from '../../../hooks';

export const Balances = () => {
  const acceptTezos = useAppSelector(selectAcceptTezos);
  const tokens = useAppSelector(selectAllAcceptedTokens);
  const services = useAppSelector(selectServicesState);
  const balances = useAppSelector(selectBalancesState);

  if (!services.initialized || !balances.initialized) {
    return <Skeleton active />;
  }

  const items = [];

  if (acceptTezos) {
    items.push(<TokenList.Item
      key={tezosMeta.symbol}
      contractAddress={''}
      ticker={tezosMeta.symbol}
      name={tezosMeta.name}
      decimals={tezosMeta.decimals}
      value={balances.tezos}
      iconSrc={tezosMeta.thumbnailUri} />);
  }

  tokens.forEach(t => {
    if (t.metadata) {
      items.push(<TokenList.Item
        key={t.metadata.symbol}
        contractAddress={''}
        ticker={t.metadata.symbol}
        name={t.metadata.name}
        decimals={t.metadata.decimals}
        value={balances.tokens[t.contractAddress] || optimization.zeroBigNumber}
        iconSrc={t.metadata.thumbnailUri} />);
    }
  });

  return <TokenList>
    {items}
  </TokenList>;
};

export const BalancesPure = React.memo(Balances);
