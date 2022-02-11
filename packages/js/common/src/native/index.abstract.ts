
import { URL as NodeURL } from 'node:url';

export type URL = NodeURL;
export const URL = NodeURL;

throw new Error('This module should\'t be included to the final bundle');
