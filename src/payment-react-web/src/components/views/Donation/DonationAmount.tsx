import { InputNumber } from 'antd';
import { BigNumber } from 'bignumber.js';
import { useCallback, useRef } from 'react';

import { tezosMeta } from '@tezospayments/common/dist/models/blockchain';

import './DonationAmount.scss';

interface DonationAmountProps {
  onChange: (rawValue: string) => void;
  desiredAmount?: BigNumber;
}

export const DonationAmount = (props: DonationAmountProps) => {
  const inputAmountRef = useRef<HTMLInputElement>(null);
  const handleCurrencyIconClick = useCallback(() => inputAmountRef.current?.focus(), []);

  return <div className="donation-amount">
    <img className="donation-amount__currency-icon"
      src={tezosMeta.thumbnailUri}
      alt="Currency"
      draggable="false"
      onClick={handleCurrencyIconClick}
    />
    <InputNumber className="donation-amount__input"
      ref={inputAmountRef}
      size="large"
      min="0"
      defaultValue={props.desiredAmount?.toString()}
      onChange={props.onChange}
    />
    <div className="donation-amount__currency">
      <span className="donation-amount__currency-name">{tezosMeta.name}</span>
      <span className="donation-amount__ticker">{tezosMeta.symbol}</span>
    </div>
  </div>;
};
