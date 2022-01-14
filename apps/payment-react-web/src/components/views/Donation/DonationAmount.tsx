import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, InputNumber, Menu } from 'antd';
import { BigNumber } from 'bignumber.js';
import { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Service, tezosMeta, Token } from '@tezospayments/common';

import './DonationAmount.scss';

import { selectTokensState } from '../../../store/currentPayment/selectors';

interface DonationAmountProps {
  service: Service;
  amount?: BigNumber;
  onAmountChange: (rawValue: string) => void;
  asset: string | undefined;
  onAssetChange: (asset: string) => void;
}

export const DonationAmount = (props: DonationAmountProps) => {
  const inputAmountRef = useRef<HTMLInputElement>(null);
  const handleCurrencyIconClick = useCallback(() => inputAmountRef.current?.focus(), []);
  const tokens = useSelector(selectTokensState);

  const allowedTokens: Token[] = [];
  props.service.allowedTokens.assets.forEach(a => {
    const token = tokens.get(a);
    if (token) {
      allowedTokens.push(token);
    }
  });

  const assets: Array<{ ticker: string; name: string; value: string; imageUrl: string }> = [];
  if (props.service.allowedTokens.tez) {
    assets.push({ value: '', ticker: tezosMeta.symbol, name: tezosMeta.name, imageUrl: tezosMeta.thumbnailUri });
  }
  allowedTokens.forEach(t => t.metadata && assets.push({ value: t.contractAddress, ticker: t.metadata.symbol, name: t.metadata.name, imageUrl: t.metadata.thumbnailUri }));

  const menu = <Menu>
    {assets.map(a => <Menu.Item className="donation-amount-menu-item" key={a.value} onClick={() => props.onAssetChange(a.value)}>
      <img className="donation-amount-menu-item__icon" src={a.imageUrl} alt={a.ticker} />
      <span className="donation-amount-menu-item__ticker">{a.ticker}</span>
      <span className="donation-amount-menu-item__name">{a.name}</span>
    </Menu.Item >)}
  </Menu>;

  const selectedAsset = assets.filter(a => props.asset ? a.value === props.asset : a.value === '')[0];

  return <div className="donation-amount">
    <img className="donation-amount__currency-icon"
      src={selectedAsset?.imageUrl}
      alt="Currency"
      draggable="false"
      onClick={handleCurrencyIconClick}
    />
    <InputNumber className="donation-amount__input"
      stringMode
      ref={inputAmountRef}
      size="large"
      min="0"
      value={props.amount?.toString()}
      onChange={props.onAmountChange}
    />
    <Dropdown trigger={['click']} overlay={menu} placement="bottomRight">
      <Button className="donation-amount__container">
        <div className="donation-amount__currency">
          <span className="donation-amount__currency-name">{selectedAsset?.name}</span>
          <span className="donation-amount__ticker">{selectedAsset?.ticker}</span>
        </div>
        <DownOutlined />
      </Button>
    </Dropdown>
  </div>;
};