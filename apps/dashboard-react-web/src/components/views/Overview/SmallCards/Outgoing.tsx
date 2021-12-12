import { Skeleton } from 'antd';
import BigNumber from 'bignumber.js';
import React from 'react';

import { tezosMeta } from '@tezospayments/common';

import { selectAcceptTezos, selectAllAcceptedTokens, selectServicesState } from '../../../../store/services/selectors';
import { TokenList } from '../../../common';
import { useAppSelector } from '../../../hooks';

export const Outgoing = () => {
  const acceptTezos = useAppSelector(selectAcceptTezos);
  const services = useAppSelector(selectServicesState);
  const tokens = useAppSelector(selectAllAcceptedTokens);

  if (!services.initialized) {
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
      value={new BigNumber(-52.4)}
      iconSrc={tezosMeta.thumbnailUri}
      highlightSign />);
  }

  tokens.forEach(t => {
    if (t.metadata) {
      items.push(<TokenList.Item
        key={t.metadata.symbol}
        contractAddress={t.contractAddress}
        ticker={t.metadata.symbol}
        name={t.metadata.name}
        decimals={t.metadata.decimals}
        value={new BigNumber(-462518.0000006)}
        iconSrc={t.metadata.thumbnailUri}
        highlightSign />);
    }
  });

  return <TokenList>
    {items}
  </TokenList>;
};

export const OutgoingPure = React.memo(Outgoing);
