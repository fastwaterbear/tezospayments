import {
  isWatchMode,
  getDefaultES, getDefaultESUmd,
  getESNext,
  getES5, getES5Umd
} from '../../../scripts/rollup.config.base.mjs';

console.log('Is the Watch mode:', isWatchMode);

const umdGlobals = {
  '@taquito/taquito': 'taquito',
  '@taquito/utils': 'taquitoUtils',
  '@taquito/signer': 'taquitoSigner',
  'libsodium-wrappers': 'sodium'
};

export default isWatchMode
  ? getDefaultES('es', 'index.esm.js', true, true)
  : [
    getDefaultES('es', ['index.esm.js', 'index.mjs'], true),
    getDefaultES('cjs', ['index.cjs.js', 'index.cjs']),
    getDefaultESUmd('umd', 'index.umd.js', 'tezosPayments', umdGlobals),

    getESNext('es', ['esnext/index.esm.js', 'esnext/index.mjs']),
    getESNext('cjs', ['esnext/index.cjs.js', 'esnext/index.cjs']),

    getES5('es', ['es5/index.esm.js', 'es5/index.mjs']),
    getES5('cjs', ['es5/index.cjs.js', 'es5/index.cjs']),
    getES5Umd('umd', 'es5/index.umd.js', 'tezosPayments', umdGlobals),
  ];
