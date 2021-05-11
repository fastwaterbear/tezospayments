import { Entity } from './entity';

export type NonEntity<T extends Entity<unknown>> = Omit<T, 'id'>;
