import type { Product } from '../models/product';

export const products: readonly Product[] = [
  {
    id: 0,
    name: 'Fitness Bracelet',
    price: [9.99, 'XTZ'],
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6'
  },
  {
    id: 1,
    name: 'Watch',
    price: [19.99, 'XTZ'],
    imageUrl: 'https://images.unsplash.com/photo-1562157705-52df57a5883b'
  },
  {
    id: 2,
    name: 'Smart Speaker',
    price: [59.77, 'XTZ'],
    imageUrl: 'https://images.unsplash.com/photo-1587145717184-e7ee5311253d'
  },
];
