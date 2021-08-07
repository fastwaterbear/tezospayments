import { InputNumber, Select } from 'antd';
import React from 'react';

import './PaymentAmount.scss';

interface DonationAmountProps {
  onChange: (rawValue: string) => void;
}

export const PaymentAmount = (props: DonationAmountProps) => {
  const assetsOptions = [
    { label: 'XTZ', value: 'XTZ' },
  ];

  return <div className="payment-amount">
    <Select className="payment-amount__select" options={assetsOptions} defaultValue={assetsOptions[0]?.value} />
    <InputNumber className="payment-amount__input" min={'0'} defaultValue={'1'} onChange={props.onChange} />
  </div>;
};

export const PaymentAmountPure = React.memo(PaymentAmount);
