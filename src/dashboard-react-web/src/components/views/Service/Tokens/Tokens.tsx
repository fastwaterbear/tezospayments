import React from 'react';

import { tezosMeta, Token, Service } from '@tezospayments/common';

import { selectTokensState } from '../../../../store/services/selectors';
import { TokenList } from '../../../common';
import { useAppSelector } from '../../../hooks';

import './Tokens.scss';

interface TokensProps {
  service: Service
}

export const Tokens = ({ service }: TokensProps) => {
  const tokens = useAppSelector(selectTokensState);
  const allowedTokens: Token[] = [];
  service?.allowedTokens.assets.forEach(a => {
    const token = tokens.get(a);
    if (token) {
      allowedTokens.push(token);
    }
  });

  const tokenItems = [];
  if (service?.allowedTokens.tez) {
    tokenItems.push(<TokenList.Item
      key={tezosMeta.symbol}
      className="service-token-list-item"
      ticker={tezosMeta.symbol}
      name={tezosMeta.name}
      decimals={tezosMeta.decimals}
      iconSrc={tezosMeta.thumbnailUri}
      highlightSign />);
  }

  allowedTokens.forEach(t => {
    tokenItems.push(<TokenList.Item
      key={t.metadata?.symbol}
      className="service-token-list-item"
      ticker={t.metadata?.symbol || 'unknown'}
      name={t.metadata?.name || 'unknown'}
      decimals={t.metadata ? t.metadata.decimals : 2}
      iconSrc={t.metadata?.thumbnailUri}
      highlightSign />);
  });

  return <TokenList>
    {tokenItems}
  </TokenList>;
};

export const TokensPure = React.memo(Tokens);
