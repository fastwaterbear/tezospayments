import type { Money } from './money';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: Money;
  readonly image: string | StaticImageData;
}
