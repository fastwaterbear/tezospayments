import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import config from '../../config';
import type { Money } from '../../models';
import { getFormattedMoney } from '../../utils';
import { ButtonPure } from '../Button';
import cssClasses from './Product.module.css';

interface ProductProps {
  name: string;
  price: Money;
  imageUrl: string;
}

const getPaymentUrl = (orderId: string, price: Money) => {
  const payment = {
    amount: price[0].toString(),
    data: {
      public: {
        orderId
      }
    },
    created: Date.now(),
  };
  const rawPayment = Buffer.from(JSON.stringify(payment), 'utf8').toString('base64');

  return `${config.paymentBaseUrl}/${config.serviceContractAddress}/payment#${rawPayment}`;
};

export const Product = (props: ProductProps) => {
  const handleBuyButtonClick = useCallback(
    () => {
      window.location.href = getPaymentUrl(uuid(), props.price);
    },
    [props.price]
  );

  return <div className={cssClasses.product}>
    <div className={cssClasses['product__image-container']}>
      {/* TODO: use the next/image when a site will be not static */
        /* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.imageUrl} alt={props.name} />
    </div>
    <div className={cssClasses['product__product-info']}>
      <span className={cssClasses.product__name}>{props.name}</span>

    </div>
    <ButtonPure type="primary" className={cssClasses['product__buy-button']} onClick={handleBuyButtonClick}>
      Buy <span className={cssClasses.product__price}>{getFormattedMoney(props.price)}</span>
    </ButtonPure>
  </div>;
};

export const ProductPure = React.memo(Product);