import React from 'react';

import { Product as ProductModel } from '../../models/product';
import { ProductPure } from '../Product';
import cssClasses from './Products.module.css';

interface ProductsProps {
  products: readonly ProductModel[];
}

export const Products = (props: ProductsProps) => {
  return <div className={cssClasses.products}>
    {props.products.map(product => <ProductPure key={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl} />)}
  </div>;
};

export const ProductsPure = React.memo(Products);
