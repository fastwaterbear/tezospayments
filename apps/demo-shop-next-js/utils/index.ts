import combineClassNames from 'clsx';

import { Money } from '../models';

const customCurrencyFormatters = new Map<string, (money: Money) => string>()
  .set('XTZ', money => `${money[0].toLocaleString(undefined, { minimumFractionDigits: 2 })} ꜩ`);

const getFormattedMoney = (money: Money) => {
  const currencyFormatter = customCurrencyFormatters.get(money[1]);

  return currencyFormatter
    ? currencyFormatter(money)
    : money[0]
      .toLocaleString(undefined, {
        style: 'currency',
        currency: money[1],
        currencyDisplay: 'symbol'
      });
};

export {
  getFormattedMoney,
  combineClassNames
};
