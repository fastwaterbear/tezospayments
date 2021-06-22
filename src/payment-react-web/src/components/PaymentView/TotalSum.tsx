import { tezosIcon } from '../../assets/icons';
import './TotalSum.scss';

export const TotalSum = () => {
  return <div className="total-sum">
    <img className="total-sum__currency-icon" src={tezosIcon} alt="Currency" draggable="false" />
    <h1 className="total-sum__value">23262.2382</h1>
    <div className="total-sum__currency">
      <span className="total-sum__currency-name">Tezos</span>
      <span className="total-sum__ticker">XTZ</span>
    </div>
  </div>;
};
