import combineClassNames from 'clsx';

import * as base64 from './base64';
import * as converters from './converters';
import * as guards from './guards';
import { memoize } from './memoize';
import optimization from './optimization';
import shallowEqual from './shallowEqual';
import * as text from './text';

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export {
  wait,
  combineClassNames,
  memoize,
  shallowEqual,
  base64,
  optimization,
  guards,
  text,
  converters
};
