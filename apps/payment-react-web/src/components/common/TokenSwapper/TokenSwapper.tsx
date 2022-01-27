import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import { tezosMeta, unknownAssetMeta } from '@tezospayments/common';

import { getSelectTokenBalanceDiff } from '../../../store/balances/selectors';
import { selectTokensState } from '../../../store/currentPayment/selectors';
import { selectSwapState } from '../../../store/swap/selectors';
import { useAppSelector } from '../../hooks';

import './TokenSwapper.scss';

interface TokenSwapperProps {
  amount: BigNumber;
  payAsset: string;
  swapAsset: string | null;
  onSwapAssetChange: (value: string) => void;
}

export const TokenSwapper = (props: TokenSwapperProps) => {
  const diff = useAppSelector(getSelectTokenBalanceDiff(props.payAsset, props.amount));
  const insufficientAmount = BigNumber.max(diff.multipliedBy(-1), 0);
  const tokens = useAppSelector(selectTokensState);
  const ticker = props.payAsset ? (tokens.get(props.payAsset)?.metadata || unknownAssetMeta).symbol : tezosMeta.symbol;
  const swapTokensState = useAppSelector(selectSwapState);

  const assets: Array<{ ticker: string; name: string; value: string; imageUrl: string, amount: BigNumber }> = [];
  if (swapTokensState?.tezos)
    assets.push({ value: '', ticker: tezosMeta.symbol, name: tezosMeta.name, imageUrl: tezosMeta.thumbnailUri, amount: swapTokensState.tezos });

  tokens.forEach(t => {
    if (t.metadata) {
      const amount = swapTokensState ? swapTokensState.tokens?.[t.contractAddress] : null;

      if (amount) {
        assets.push({
          value: t.contractAddress,
          ticker: t.metadata.symbol,
          name: t.metadata.name,
          imageUrl: t.metadata.thumbnailUri,
          amount
        });
      }
    }
  });

  const selectedAsset = assets.find(a => a.value === props.swapAsset);

  const menu = <Menu>
    {assets.map(a => <Menu.Item className="token-swapper-menu-item" key={a.value} onClick={() => props.onSwapAssetChange(a.value)}>
      <span className="token-swapper-menu-item__icon">{a.amount.toString()}</span>
      <img className="token-swapper-menu-item__icon" src={a.imageUrl} alt={a.ticker} />
      <span className="token-swapper-menu-item__ticker">{a.ticker}</span>
      <span className="token-swapper-menu-item__name">{a.name}</span>
    </Menu.Item >)}
  </Menu>;

  return <div className="token-swapper">
    <span>Not enough {insufficientAmount.toString()} {ticker}</span>
    {assets.length > 0 && <div className="token-swapper__swap-line">
      <div>Swap</div>
      <div className="token-swapper__input-container">
        <Dropdown trigger={['click']} overlay={menu} placement="bottomRight">
          <Button className="token-swapper__container">
            <div className="token-swapper__currency">
              <span className="token-swapper__amount">{selectedAsset?.amount.toString()}</span>
              <img className="token-swapper__icon" src={selectedAsset?.imageUrl} alt={selectedAsset?.ticker} />
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
