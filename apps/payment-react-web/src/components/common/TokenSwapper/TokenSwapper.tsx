import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import { tezosMeta, Token, unknownAssetMeta } from '@tezospayments/common';

import { getSelectTokenBalanceDiff } from '../../../store/balances/selectors';
import { selectTokensState } from '../../../store/currentPayment/selectors';
import { selectCanSwap, selectSwapState } from '../../../store/swap/selectors';
import { useAppSelector } from '../../hooks';

import './TokenSwapper.scss';

interface TokenSwapperProps {
  amount: BigNumber;
  assetAddress: string | undefined;
}

export const TokenSwapper = (props: TokenSwapperProps) => {
  const diff = useAppSelector(getSelectTokenBalanceDiff(props.assetAddress, props.amount));
  const insufficientAmount = BigNumber.max(diff.multipliedBy(-1), 0);
  const tokens = useAppSelector(selectTokensState);
  const ticker = props.assetAddress ? (tokens.get(props.assetAddress)?.metadata || unknownAssetMeta).symbol : tezosMeta.symbol;

  const canSwap = useAppSelector(selectCanSwap);
  const swapTokensState = useAppSelector(selectSwapState);
  const allowedTokens: Token[] = [];

  if (swapTokensState?.tokens) {
    Object.keys(swapTokensState.tokens).forEach(k => {
      const token = tokens.get(k);
      if (token) {
        allowedTokens.push(token);
      }
    });
  }

  const assets: Array<{ ticker: string; name: string; value: string; imageUrl: string }> = [];
  if (swapTokensState?.tezos) {
    assets.push({ value: '', ticker: tezosMeta.symbol, name: tezosMeta.name, imageUrl: tezosMeta.thumbnailUri });
  }
  allowedTokens.forEach(t => t.metadata && assets.push({ value: t.contractAddress, ticker: t.metadata.symbol, name: t.metadata.name, imageUrl: t.metadata.thumbnailUri }));

  const selectedAsset = assets[0];
  const amountToSell = selectedAsset && swapTokensState
    ? selectedAsset.value
      ? swapTokensState.tokens?.[selectedAsset.value]
      : swapTokensState.tezos
    : null;

  const menu = <Menu>
    {assets.map(a => <Menu.Item className="token-swapper-menu-item" key={a.value}>
      <img className="token-swapper-menu-item__icon" src={a.imageUrl} alt={a.ticker} />
      <span className="token-swapper-menu-item__ticker">{a.ticker}</span>
      <span className="token-swapper-menu-item__name">{a.name}</span>
    </Menu.Item >)}
  </Menu>;

  return <div className="token-swapper">
    <span>Not enough {insufficientAmount.toString()} {ticker}</span>
    {canSwap && <div className="token-swapper__swap-line">
      <div>Swap</div>
      <div className="token-swapper__input-container">
        <span className="token-swapper__amount">{amountToSell?.toString()}</span>
        <Dropdown trigger={['click']} overlay={menu} placement="bottomRight">
          <Button className="token-swapper__container">
            <div className="token-swapper__currency">
              <span className="token-swapper__currency-name">{selectedAsset?.name}</span>
              <span className="token-swapper__ticker">{selectedAsset?.ticker}</span>
            </div>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>}
  </div >;
};

export const TokenSwapperPure = React.memo(TokenSwapper);
