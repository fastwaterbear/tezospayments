import type { Product } from '../models/product';
import fitnessBraceletImageUrl from '../public/products/0-fitness-bracelet.jpg';
import watchImageUrl from '../public/products/1-watch.jpg';
import smartSpeakerImageUrl from '../public/products/2-smart-speaker.jpg';

export const products: readonly Product[] = [
  {
    id: 0,
    name: 'Fitness Bracelet',
    price: [9.99, 'XTZ'],
    image: fitnessBraceletImageUrl
  },
  {
    id: 1,
    name: 'Watch',
    price: [19.99, 'XTZ'],
    image: watchImageUrl
  },
  {
    id: 2,
    name: 'Smart Speaker',
    price: [59.77, 'XTZ'],
    image: smartSpeakerImageUrl
  },
];
