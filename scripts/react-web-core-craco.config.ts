import webpack, { Configuration } from 'webpack';

export default {
  webpack: {
    configure: (webpackConfig: Configuration) => {
      const webpackConfigResolveFallback: NonNullable<Configuration['resolve']>['fallback'] = {
        // For libsodium
        path: false,
        os: false,
        crypto: false,

        // For @airgap/beacon-sdk
        // https://github.com/airgap-it/beacon-sdk/blob/f7311217e58ddbe9d14553c85d318c09fad8a7cc/src/utils/crypto.ts#L13
        buffer: require.resolve('buffer'),

        // For @taquito/signer -> pbkdf2 -> ... -> cipher-base
        // https://github.com/crypto-browserify/cipher-base/issues/10
        // https://github.com/crypto-browserify/cipher-base/pull/16
        stream: require.resolve('stream-browserify'),
      };

      const webpackConfigExternals: Configuration['externals'] = [
        // @taquito/http-utils only uses the "xhr2-cookies" package in node.js
        // https://github.com/ecadlabs/taquito/blob/7f83cc898e4fe218f63c7e1bc4b4e0d6ce6d7ca2/packages/taquito-http-utils/src/taquito-http-utils.ts#L8-L11
        // So we can ignore the xhr2-cookies
        { 'xhr2-cookies': 'undefined' }
      ];

      const webpackConfigIgnoreWarnings: Configuration['ignoreWarnings'] = [
        /Failed to parse source map/
      ];

      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = webpackConfig.resolve.fallback instanceof Array
        ? webpackConfigResolveFallback
        : { ...webpackConfig.resolve.fallback, ...webpackConfigResolveFallback };

      webpackConfig.externals = webpackConfig.externals instanceof Array
        ? webpackConfig.externals.concat(webpackConfigExternals)
        : webpackConfigExternals;

      webpackConfig.ignoreWarnings = webpackConfig.ignoreWarnings
        ? webpackConfig.ignoreWarnings.concat(webpackConfigIgnoreWarnings)
        : webpackConfigIgnoreWarnings;

      webpackConfig.plugins = webpackConfig.plugins || [];
      // https://github.com/webpack/changelog-v5/issues/10
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    },
  }
};
