import combineClassNames from 'clsx';

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
  optimization,
  guards,
  text,
};
