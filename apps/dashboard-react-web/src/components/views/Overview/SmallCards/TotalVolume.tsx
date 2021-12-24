import { Skeleton } from 'antd';
import BigNumber from 'bignumber.js';
import React from 'react';

import { OperationDirection, tezosMeta } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { selectTotalVolumeByTokens } from '../../../../store/operations/selectors';
import { selectAcceptTezos, selectAllAcceptedTokens, selectServicesState } from '../../../../store/services/selectors';
import { TokenList } from '../../../common';
import { useAppSelector } from '../../../hooks';

interface TotalVolumeProps {
  direction: OperationDirection;
}

export const TotalVolume = (props: TotalVolumeProps) => {
  const acceptTezos = useAppSelector(selectAcceptTezos);
  const services = useAppSelector(selectServicesState);
  const tokens = useAppSelector(selectAllAcceptedTokens);
  const volume = useAppSelector(state => selectTotalVolumeByTokens(state, 'all', Period.LastWeek, props.direction));

  if (!services.initialized) {
    return <Skeleton active />;
  }

  const multiplier = props.direction === OperationDirection.Incoming ? 1 : -1;
  const items = [];

  if (acceptTezos) {
    items.push(<TokenList.Item
      key={tezosMeta.symbol}
      contractAddress={''}
      ticker={tezosMeta.symbol}
      name={tezosMeta.name}
      decimals={tezosMeta.decimals}
      value={(volume.get(tezosMeta.symbol) || new BigNumber(0)).multipliedBy(multiplier)}
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
        value={(volume.get(t.metadata.symbol) || new BigNumber(0)).multipliedBy(multiplier)}
        iconSrc={t.metadata.thumbnailUri}
        highlightSign />);
    }
  });

  return <TokenList>
    {items}
  </TokenList>;
};

export const TotalVolumePure = React.memo(TotalVolume);
