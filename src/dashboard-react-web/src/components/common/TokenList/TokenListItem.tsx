import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { combineClassNames } from '@tezospayments/common';

import './TokenListItem.scss';

interface TokenListItemProps {
  name: string;
  ticker: string;
  iconSrc?: string;
  value?: number;
  decimals?: number;
  highlightSign?: boolean;
  className?: string;
  handleDelete?: (ticker: string) => void;
}

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

  const decimals = props.decimals !== undefined ? props.decimals : 2;

  const displayedDecimals = 6;
  const value = props.value && Math.abs(props.value);
  const allDecimalsShown = displayedDecimals < decimals;
  const valueSpan = value !== undefined && value !== null ? <span className={valueClassNames}>
    {`${sign}${value.toLocaleString(undefined, { minimumFractionDigits: displayedDecimals })}${allDecimalsShown ? '...' : ''}`}
  </span> : null;

  return <li className={combineClassNames('token-list-item', props.className)}>
    <img className="token-list-item__icon" src={props.iconSrc} alt={props.name} />
    <div>
      <div className="token-list-item__name-container">
        <span className="token-list-item__ticker">{props.ticker}</span>
        <span className="token-list-item__name">{props.name}</span>
        {props.handleDelete && <Button className="service-link-editor__delete-button" type="text" danger icon={<DeleteOutlined />} onClick={() => props.handleDelete?.(props.ticker)} />}
      </div>
      {allDecimalsShown && value !== undefined && value !== null
        ? <Tooltip title={value.toLocaleString(undefined, { minimumFractionDigits: decimals })}>
          {valueSpan}
        </Tooltip>
        : valueSpan}
    </div>
  </li>;
};
