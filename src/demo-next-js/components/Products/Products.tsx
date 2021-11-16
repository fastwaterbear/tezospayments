import React, { useCallback, useState } from 'react';

import { Product as ProductModel } from '../../models/product';
import { ProductPure } from '../Product';
import cssClasses from './Products.module.css';

interface ProductsProps {
  products: readonly ProductModel[];
}

const getPaymentUrl = async (productId: number): Promise<string> => {
  const response = await fetch(
    '/api/payment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    }
  );
  const result = await response.text();

  if (!response.ok)
    throw new Error(result);

  return result;
};

export const Products = (props: ProductsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleBuyButtonClick = useCallback(
    async (productId: number) => {
      setIsLoading(true);

      try {
        const url = await getPaymentUrl(productId);
        window.location.href = url;
      }
      catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    },
    []
  );

  return <div className={cssClasses.products}>
    {props.products.map(product => <ProductPure key={product.id}
      id={product.id}
      name={product.name}
      price={product.price}
      image={product.image}
      isLoading={isLoading}
      onBuy={handleBuyButtonClick}
    />)}
  </div>;
};

export const ProductsPure = React.memo(Products);
