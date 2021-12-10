/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { URL as NodeURL } from 'url';

export type URL = NodeURL;
export const URL = NodeURL || (globalThis as any).URL;
