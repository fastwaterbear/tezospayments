import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import BigNumber from 'bignumber.js';

import { combineClassNames } from '@tezospayments/common';

import './TokenListItem.scss';

interface TokenListItemProps {
  name: string;
  ticker: string;
  contractAddress: string;
  iconSrc?: string;
  value?: BigNumber;
  decimals?: number;
  highlightSign?: boolean;
  className?: string;
  handleDelete?: (contractAddress: string) => void;
}

const getStringAmounts = (value: BigNumber): [string, string] => {
  const displayedDecimals = 6;
  const shortAmount = value.toFormat(displayedDecimals, { groupSeparator: '', decimalSeparator: '.' });
  const amount = value.toString();

  return [amount.substring(0, shortAmount.length), amount];
};

export const TokenListItem = (props: TokenListItemProps) => {
  const isPositive = props.value && !props.value.isZero() && props.value.isPositive();
  const isNegative = props.value && !props.value.isZero() && props.value.isNegative();

  const valueClassNames = combineClassNames('token-list-item__value',
    { 'token-list-item__value_positive': props.highlightSign && isPositive },
    { 'token-list-item__value_negative': isNegative }
  );

  const sign = isNegative
    ? '-'
    : props.highlightSign && isPositive
      ? '+'
      : '';

  const value = props.value && props.value.abs();
  const [shortAmount, amount] = value !== undefined && value !== null ? getStringAmounts(value) : [null, null];
  const allDecimalsShown = shortAmount !== null && amount !== null && (shortAmount === amount || amount.substr(shortAmount.length).split('').every(s => s === '0'));
  const amountSpan = shortAmount && <span className={valueClassNames}>
    {`${sign}${shortAmount}${allDecimalsShown ? '' : '...'}`}
  </span>;

  return <li className={combineClassNames('token-list-item', props.className)}>
    <img className="token-list-item__icon" src={props.iconSrc} alt={props.name} />
    <div>
      <div className="token-list-item__name-container">
        <span className="token-list-item__ticker">{props.ticker}</span>
        <span className="token-list-item__name">{props.name}</span>
        {props.handleDelete && <Button
          className="service-link-editor__delete-button"
          type="text" danger icon={<DeleteOutlined />}
          onClick={() => props.handleDelete?.(props.contractAddress)} />}
      </div>
      {!allDecimalsShown && value !== undefined && value !== null
        ? <Tooltip title={amount}>
          {amountSpan}
        </Tooltip>
        : amountSpan}
    </div>
  </li>;
};
