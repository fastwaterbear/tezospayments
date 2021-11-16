import Image from 'next/image';
import React, { useCallback } from 'react';

import type { Money } from '../../models';
import { getFormattedMoney } from '../../utils';
import { ButtonPure } from '../Button';
import cssClasses from './Product.module.css';

interface ProductProps {
  id: number;
  name: string;
  price: Money;
  image: string | StaticImageData;
  isLoading?: boolean;
  onBuy: (productId: number) => void;
}

export const Product = ({ id, name, price, image, onBuy, isLoading }: ProductProps) => {
  const handleBuyButtonClick = useCallback(() => !isLoading && onBuy(id), [isLoading, onBuy, id]);

  return <div className={cssClasses.product}>
    <div className={cssClasses['product__image-container']}>
      <Image src={image} alt={name} />
    </div>
    <div className={cssClasses['product__product-info']}>
      <span className={cssClasses.product__name}>{name}</span>
    </div>
    <ButtonPure type="primary" className={cssClasses['product__buy-button']} onClick={handleBuyButtonClick} disabled={isLoading}>
      Buy <span className={cssClasses.product__price}>{getFormattedMoney(price)}</span>
    </ButtonPure>
  </div>;
};

export const ProductPure = React.memo(Product);
