import { BigNumber } from 'bignumber.js';
import React, { useCallback } from 'react';

import { combineClassNames } from '@tezospayments/common';

import { useAppSelector } from '../../hooks';

import './Balance.scss';

interface BalanceProps {
  className?: string;
  assetAddress?: string;
  onClick?: (value: BigNumber) => void
}

export const Balance = (props: BalanceProps) => {
  const balances = useAppSelector(state => state.balancesState);

  const amount = !balances
    ? null
    : props.assetAddress
      ? balances.tokens[props.assetAddress] || null
      : balances.tezos;

  const handleAmountClick = useCallback(
    () => {
      if (amount !== null)
        props.onClick?.(amount);
    }, [amount, props]
  );

  const loading = amount == null;
  const amountString = loading ? 'loading...' : amount.toString();
  const amountClassName = combineClassNames(
    'balance__amount',
    { balance__amount_clickable: !loading && props.onClick },
  );

  return <div className={combineClassNames('balance', props.className)}>
    <span className="balance__title">Balance:</span>
    <span onClick={handleAmountClick} className={amountClassName}>{amountString}</span>
  </div>;
};

export const BalancePure = React.memo(Balance);
