import combineClassNames from 'clsx';
import * as converters from './converters';
import * as guards from './guards';
import { memoize } from './memoize';
import optimization from './optimization';
import shallowEqual from './shallowEqual';
import * as text from './text';
declare const wait: (ms: number) => Promise<void>;
export { wait, combineClassNames, memoize, shallowEqual, optimization, guards, text, converters };
