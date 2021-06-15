import { Tooltip } from 'antd';

import { combineClassNames } from '@tezos-payments/common/dist/utils';
import './TokenList.scss';

interface TokenListProps {
  children: React.ReactNode;
}

export const TokenList = (props: TokenListProps) => {
  return <ul className="token-list">
    {props.children}
  </ul>;
};

interface TokenListItemProps {
  name: string;
  ticker: string;
  iconSrc?: string;
  value: number;
  decimals: number;
  highlightSign?: boolean;
}

const TokenListItem = (props: TokenListItemProps) => {
  const valueClassNames = combineClassNames('token-list-item__value',
    { 'token-list-item__value_positive': props.highlightSign && props.value > 0 },
    { 'token-list-item__value_negative': props.highlightSign && props.value < 0 }
  );

  const sign = props.value > 0 && props.highlightSign
    ? '+'
    : props.value < 0
      ? '−'
      : '';

  const displayedDecimals = 6;
  const value = Math.abs(props.value);
  const allDecimalsShown = displayedDecimals < props.decimals;
  const valueSpan = <span className={valueClassNames}>
    {`${sign}${value.toLocaleString(undefined, { minimumFractionDigits: displayedDecimals })}${allDecimalsShown ? '...' : ''}`}
  </span>;

  return <li className="token-list-item">
    <img className="token-list-item__icon" src={props.iconSrc} alt={props.name} />
    <div>
      <div className="token-list-item__name-container">
        <span className="token-list-item__ticker">{props.ticker}</span>
        <span className="token-list-item__name">{props.name}</span>
      </div>
      {allDecimalsShown
        ? <Tooltip title={value.toLocaleString(undefined, { minimumFractionDigits: props.decimals })}>
          {valueSpan}
        </Tooltip>
        : valueSpan
      }
    </div>
  </li>;
};

TokenList.Item = TokenListItem;
