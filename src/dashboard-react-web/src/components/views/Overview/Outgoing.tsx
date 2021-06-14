import { Skeleton } from 'antd';
import React from 'react';

import { tezosMeta } from '../../../models/blockchain';
import { getAcceptTezos, getAllAcceptedTokens, selectServicesState } from '../../../store/services/selectors';
import { TokenList } from '../../common';
import { useAppSelector } from '../../hooks';

export const Outgoing = () => {
  const acceptTezos = useAppSelector(getAcceptTezos);
  const services = useAppSelector(selectServicesState);
  const tokens = useAppSelector(getAllAcceptedTokens);

  if (!services.initialized) {
    return <Skeleton active />;
  }

  const items = [];

  if (acceptTezos) {
    items.push(<TokenList.Item key={tezosMeta.symbol} ticker={tezosMeta.symbol} name={tezosMeta.name} value={-52.4} iconSrc={tezosMeta.thumbnailUri} highlightSign />);
  }

  tokens.forEach(t => {
    // eslint-disable-next-line max-len
    items.push(<TokenList.Item key={t.metadata?.symbol} ticker={t.metadata?.symbol || 'unknown'} name={t.metadata?.name || 'unknown'} value={-462518} iconSrc={t.metadata?.thumbnailUri} highlightSign />);
  });

  return <TokenList>
    {items}
  </TokenList>;
};


export const OutgoingPure = React.memo(Outgoing);
