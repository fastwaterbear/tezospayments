import { InputNumber, Select } from 'antd';
import React from 'react';

import { tezosMeta } from '@tezospayments/common';

import './PaymentAmount.scss';

interface DonationAmountProps {
  onChange: (rawValue: string) => void;
  value: string;
}

export const PaymentAmount = (props: DonationAmountProps) => {
  const assets = [
    { label: tezosMeta.symbol, value: tezosMeta.symbol, imageUrl: tezosMeta.thumbnailUri },
  ];

  const options = assets.map(a => <Select.Option key={a.label} value={a.value} label={a.label}>
    <div className="payment-amount__select-option">
      <img className="payment-amount__select-option-image" alt={a.label} src={a.imageUrl} />
      <span className="payment-amount__select-option-label">{a.label}</span>
    </div>
  </Select.Option>);

  return <div className="payment-amount">
    <Select className="payment-amount__select" value={tezosMeta.symbol}>
      {options}
    </Select>
    <InputNumber className="payment-amount__input" min={'0'} value={props.value.toString()} onChange={props.onChange} />
  </div>;
};

export const PaymentAmountPure = React.memo(PaymentAmount);
