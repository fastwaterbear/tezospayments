import React from 'react';

import type { Money } from '../../models';
import { getFormattedMoney } from '../../utils';
import { ButtonPure } from '../Button';
import cssClasses from './Product.module.css';

interface ProductProps {
  name: string;
  price: Money;
  imageUrl: string;
}

export const Product = (props: ProductProps) => {
  return <div className={cssClasses.product}>
    <div className={cssClasses['product__image-container']}>
      {/* TODO: use the next/image when a site will be not static */
        /* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.imageUrl} alt={props.name} />
    </div>
    <div className={cssClasses['product__product-info']}>
      <span className={cssClasses.product__name}>{props.name}</span>

    </div>
    <ButtonPure type="primary" className={cssClasses['product__buy-button']}>Buy <span className={cssClasses.product__price}>{getFormattedMoney(props.price)}</span></ButtonPure>
  </div>;
};

export const ProductPure = React.memo(Product);
