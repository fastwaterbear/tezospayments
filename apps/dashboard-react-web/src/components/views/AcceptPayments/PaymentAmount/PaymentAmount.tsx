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
  asset: string | undefined;
  onAssetChange: (ticker: string) => void;
}

export const PaymentAmount = (props: DonationAmountProps) => {
  const services = useAppSelector(selectServicesState);
  const service = services.services.find(s => s.contractAddress === props.serviceAddress);
  const tokens = useAppSelector(selectTokensState);
  const assets: Array<{ label: string; value: string; imageUrl: string }> = [];

  if (service) {
    const allowedTokens: Token[] = [];
    service.allowedTokens.assets.forEach(a => {
      const token = tokens.get(a);
      if (token) {
        allowedTokens.push(token);
      }
    });

    if (service.allowedTokens.tez) {
      assets.push({ label: tezosMeta.symbol, value: '', imageUrl: tezosMeta.thumbnailUri });
    }
    allowedTokens.forEach(t => t.metadata && assets.push({ label: t.metadata.symbol, value: t.contractAddress, imageUrl: t.metadata.thumbnailUri }));
  }

  const options = assets.map(a => <Select.Option key={a.label} value={a.value} label={a.label}>
    <div className="payment-amount__select-option">
      <img className="payment-amount__select-option-image" alt={a.label} src={a.imageUrl} />
      <span className="payment-amount__select-option-label">{a.label}</span>
    </div>
  </Select.Option>);

  const disabled = assets.length === 0;

  return <div className="payment-amount">
    <Select className="payment-amount__select" value={props.asset || ''} onChange={props.onAssetChange} disabled={disabled}>
      {options}
    </Select>
    <InputNumber
      className="payment-amount__input"
      stringMode
      min={'0'}
      value={props.amount.toString()}
      onChange={props.onAmountChange}
      disabled={disabled} />
  </div>;
};

export const PaymentAmountPure = React.memo(PaymentAmount);
