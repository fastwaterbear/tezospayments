import { Skeleton } from 'antd';
import React from 'react';

import { tezosMeta } from '@tezospayments/common';

import { getAcceptTezos, getAllAcceptedTokens, selectServicesState } from '../../../../store/services/selectors';
import { TokenList } from '../../../common';
import { useAppSelector } from '../../../hooks';

export const Outgoing = () => {
  const acceptTezos = useAppSelector(getAcceptTezos);
  const services = useAppSelector(selectServicesState);
  const tokens = useAppSelector(getAllAcceptedTokens);

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
      value={-52.4}
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
        value={-462518.0000006}
        iconSrc={t.metadata.thumbnailUri}
        highlightSign />);
    }
  });

  return <TokenList>
    {items}
  </TokenList>;
};

export const OutgoingPure = React.memo(Outgoing);
