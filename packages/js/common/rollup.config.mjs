import replace from '@rollup/plugin-replace';

import {
  isWatchMode,
  getDefaultES, getDefaultESUmd,
  getESNext,
  getES5, getES5Umd
} from '../../../scripts/rollup.config.base.mjs';

console.log('Is the Watch mode:', isWatchMode);

const getReplaceNativeModulePlugin = platform => replace({
  preventAssignment: true,
  values: { 'index.abstract': `index.${platform}`, }
});

const applyReplaceNativeModulePlugin = platform => config => {
  config.plugins.unshift(getReplaceNativeModulePlugin(platform));

  return config;
};

const getWatchConfigs = () => {
  const nodeJsConfigs = (
    platform => [
      getDefaultES('es', `${platform}/index.esm.js`, true, true),
    ].map(applyReplaceNativeModulePlugin(platform))
  )('node');

  const browserConfigs = (
    platform => [
      getDefaultES('es', `${platform}/index.esm.js`, true, true),
    ].map(applyReplaceNativeModulePlugin(platform))
  )('browser');

  return browserConfigs.concat(nodeJsConfigs);
};

const getCommonBuildConfigs = platform => {
  const configs = [
    getDefaultES('es', [`${platform}/index.esm.js`, `${platform}/index.mjs`], true),
    getESNext('es', [`${platform}/esnext/index.esm.js`, `${platform}/esnext/index.mjs`]),
    getESNext('cjs', `${platform}/esnext/index.cjs.js`),
    getES5('es', [`${platform}/es5/index.esm.js`, `${platform}/es5/index.mjs`]),
    getES5('cjs', `${platform}/es5/index.cjs.js`),
  ].map(applyReplaceNativeModulePlugin(platform));

  return configs;
};

const getNodeJSBuildConfigs = () => {
  const platform = 'node';
  const configs = [
    getDefaultES('cjs', [`${platform}/index.cjs.js`, `${platform}/index.cjs`]),
  ].map(applyReplaceNativeModulePlugin(platform));

  return getCommonBuildConfigs(platform).concat(configs);
};

const getBrowserBuildConfigs = () => {
  const platform = 'browser';

  const globals = {
    '@taquito/taquito': 'taquito',
    '@taquito/utils': 'taquitoUtils',
    '@taquito/signer': 'taquitoSigner',
    'libsodium-wrappers': 'sodium'
  };

  const configs = [
    getDefaultESUmd('umd', `${platform}/index.umd.js`, 'tezosPaymentsCommon', globals),
    getES5Umd('umd', `${platform}/es5/index.umd.js`, 'tezosPaymentsCommon', globals),
  ].map(applyReplaceNativeModulePlugin(platform));

  return getCommonBuildConfigs(platform).concat(configs);
};

export default isWatchMode
  ? getWatchConfigs()
  : getNodeJSBuildConfigs().concat(getBrowserBuildConfigs());
