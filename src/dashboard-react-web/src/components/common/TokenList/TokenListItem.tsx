import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { combineClassNames } from '@tezospayments/common';

import './TokenListItem.scss';

interface TokenListItemProps {
  name: string;
  ticker: string;
  contractAddress: string;
  iconSrc?: string;
  value?: number;
  decimals?: number;
  highlightSign?: boolean;
  className?: string;
  handleDelete?: (contractAddress: string) => void;
}

const getStringAmount = (value: number, maximumFractionDigits: number) => value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits });

const getStringAmounts = (value: number) => {
  const displayedDecimals = 6;
  const [shortAmount, amount] = [getStringAmount(value, displayedDecimals), getStringAmount(value, 20)];

  return [amount.substring(0, shortAmount.length), amount];
};

export const TokenListItem = (props: TokenListItemProps) => {
  const valueClassNames = combineClassNames('token-list-item__value',
    { 'token-list-item__value_positive': props.highlightSign && props.value && props.value > 0 },
    { 'token-list-item__value_negative': props.highlightSign && props.value && props.value < 0 }
  );

  const sign = !props.value
    ? ''
    : props.value > 0 && props.highlightSign
      ? '+'
      : props.value < 0
        ? '−'
        : '';

  const value = props.value && Math.abs(props.value);
  const [shortAmount, amount] = value !== undefined && value !== null ? getStringAmounts(value) : [null, null];
  const allDecimalsShown = shortAmount === amount;
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
