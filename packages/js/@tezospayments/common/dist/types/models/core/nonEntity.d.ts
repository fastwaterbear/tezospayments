import { Entity } from './entity';
export declare type NonEntity<T extends Entity<unknown>> = Omit<T, 'id'>;
