import { tezosMeta } from '@tezos-payments/common/dist/models/blockchain';

import './TotalAmount.scss';

interface TotalAmountProps {
  value: number;
}

export const TotalAmount = (props: TotalAmountProps) => {
  return <div className="total-amount">
    <img className="total-amount__currency-icon" src={tezosMeta.thumbnailUri} alt="Currency" draggable="false" />
    <h1 className="total-amount__value">{props.value}</h1>
    <div className="total-amount__currency">
      <span className="total-amount__currency-name">{tezosMeta.name}</span>
      <span className="total-amount__ticker">{tezosMeta.symbol}</span>
    </div>
  </div>;
};
