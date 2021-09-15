import { InputNumber, Select } from 'antd';
import React from 'react';

import { tezosMeta, Token } from '@tezospayments/common';

import './PaymentAmount.scss';
import { selectServicesState, selectTokensState } from '../../../../store/services/selectors';
import { useAppSelector } from '../../../hooks';

interface DonationAmountProps {
  serviceAddress: string | undefined;
  amount: string;
  onAmountChange: (rawValue: string) => void;
  ticker: string;
  onTickerChange: (ticker: string) => void;
}

export const PaymentAmount = (props: DonationAmountProps) => {
  const services = useAppSelector(selectServicesState);
  const service = services.services.find(s => s.contractAddress === props.serviceAddress);
  const tokens = useAppSelector(selectTokensState);

  const allowedTokens: Token[] = [];
  service?.allowedTokens.assets.forEach(a => {
    const token = tokens.get(a);
    if (token) {
      allowedTokens.push(token);
    }
  });

  const assets = [
    { label: tezosMeta.symbol, value: tezosMeta.symbol, imageUrl: tezosMeta.thumbnailUri },
  ];

  allowedTokens.forEach(t => assets.push({ label: t.metadata?.symbol || '', value: t.metadata?.symbol || '', imageUrl: t.metadata?.thumbnailUri || '' }));

  const options = assets.map(a => <Select.Option key={a.label} value={a.value} label={a.label}>
    <div className="payment-amount__select-option">
      <img className="payment-amount__select-option-image" alt={a.label} src={a.imageUrl} />
      <span className="payment-amount__select-option-label">{a.label}</span>
    </div>
  </Select.Option>);

  return <div className="payment-amount">
    <Select className="payment-amount__select" value={props.ticker} onChange={props.onTickerChange}>
      {options}
    </Select>
    <InputNumber className="payment-amount__input" min={'0'} value={props.amount.toString()} onChange={props.onAmountChange} />
  </div>;
};

export const PaymentAmountPure = React.memo(PaymentAmount);
