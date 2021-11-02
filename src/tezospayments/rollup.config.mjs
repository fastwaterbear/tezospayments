import {
  isWatchMode,
  getDefaultES, getDefaultESUmd,
  getESNext,
  getES5, getES5Umd
} from '../../scripts/rollup.config.base.mjs';

console.log('Is the Watch mode:', isWatchMode);

export default isWatchMode
  ? getDefaultES('es', 'index.esm.js', true, true)
  : [
    getDefaultES('es', ['index.esm.js', 'index.mjs'], true),
    getDefaultES('cjs', 'index.cjs.js'),
    getDefaultESUmd('umd', 'index.umd.js', 'tezosPayments', { '@taquito/signer': 'taquitoSigner' }),

    getESNext('es', ['esnext/index.esnext.esm.js', 'esnext/index.esnext.mjs']),
    getESNext('cjs', 'esnext/index.esnext.cjs.js'),

    getES5('es', ['es5/index.es5.esm.js', 'es5/index.es5.mjs']),
    getES5('cjs', 'es5/index.es5.cjs.js'),
    getES5Umd('umd', 'es5/index.es5.umd.js', 'tezosPayments', { '@taquito/signer': 'taquitoSigner' }),
  ];
