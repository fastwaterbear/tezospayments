import path from 'path';

import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typeScript from 'rollup-plugin-typescript2';

const isWatchMode = !!process.env.ROLLUP_WATCH;
const sourceDirectory = 'src';
const outputDirectory = 'dist';
const entryPointFilePath = path.join(sourceDirectory, 'index.ts');

const externalPackageNames = [
  /@babel\/runtime/
];

const defaultESBabelTargets = {
  node: '14.0.0',
  browsers: [
    '>0.35%',
    'not dead',
    'not op_mini all',
    'not ie <= 11'
  ]
};

const watchPaths = [
  `${sourceDirectory}/**`,
  /tsconfig/
];

const getBaseOutputOptions = ({ fileName, format }) => ({
  file: path.join(outputDirectory, fileName),
  format,
  sourcemap: true
});

const getBaseTypeScriptPluginOptions = declarationEnabled => ({
  tsconfigOverride: {
    compilerOptions: {
      declaration: declarationEnabled,
      composite: declarationEnabled,
      tsBuildInfoFile: null
    }
  },
  useTsconfigDeclarationDir: declarationEnabled
});

const getBaseBabelOptions = babelHelpers => ({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  exclude: 'node_modules/**',
  babelHelpers,
  presets: [
    ['@babel/preset-env', { targets: defaultESBabelTargets }],
  ],
  plugins: babelHelpers === 'runtime'
    ? ['@babel/plugin-transform-runtime']
    : []
});

const getResolvePlugins = format => format === 'umd'
  ? [
    commonjs({
      extensions: ['.js'],
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts'],
      preferBuiltins: false,
    }),
  ]
  : [
    nodeResolve({ resolveOnly: ['*'] }),
  ];

const getDefaultES = (format, outputFileNameOrNames, declarationEnabled = false, watchEnabled = false) => ({
  input: entryPointFilePath,
  output: (Array.isArray(outputFileNameOrNames) ? outputFileNameOrNames : [outputFileNameOrNames])
    .map(fileName => getBaseOutputOptions({ fileName, format })),
  external: externalPackageNames,
  watch: watchEnabled && { include: watchPaths },
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(declarationEnabled)),
    babel(getBaseBabelOptions('runtime')),
  ]
});

const getDefaultESUmd = (format, outputFileName, globalName) => ({
  input: entryPointFilePath,
  output: [
    {
      ...getBaseOutputOptions({ fileName: outputFileName, format }),
      name: globalName
    }
  ],
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(false)),
    babel(getBaseBabelOptions('bundled')),
  ]
});

const getESNext = (format, outputFileNameOrNames, declarationEnabled = false) => ({
  input: entryPointFilePath,
  output: (Array.isArray(outputFileNameOrNames) ? outputFileNameOrNames : [outputFileNameOrNames])
    .map(fileName => getBaseOutputOptions({ fileName, format })),
  external: externalPackageNames,
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(declarationEnabled)),
  ]
});

const getES5 = (format, outputFileNameOrNames, declarationEnabled = false) => ({
  input: entryPointFilePath,
  output: (Array.isArray(outputFileNameOrNames) ? outputFileNameOrNames : [outputFileNameOrNames])
    .map(fileName => getBaseOutputOptions({ fileName, format })),
  external: externalPackageNames,
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(declarationEnabled)),
    babel({
      ...getBaseBabelOptions('runtime'),
      presets: ['@babel/preset-env']
    }),
  ]
});

const getES5Umd = (format, outputFileName, globalName) => ({
  input: entryPointFilePath,
  output: [
    {
      ...getBaseOutputOptions({ fileName: outputFileName, format }),
      name: globalName
    }
  ],
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(false)),
    babel({
      ...getBaseBabelOptions('bundled'),
      presets: ['@babel/preset-env']
    }),
  ]
});

console.log('Is the Watch mode:', isWatchMode);

export default isWatchMode
  ? getDefaultES('es', 'index.esm.js', true, true)
  : [
    getDefaultES('es', ['index.esm.js', 'index.mjs'], true),
    getDefaultES('cjs', 'index.cjs.js'),
    getDefaultESUmd('umd', 'index.umd.js', 'tezosPaymentsCommon'),

    getESNext('es', ['esnext/index.esnext.esm.js', 'esnext/index.esnext.mjs']),
    getESNext('cjs', 'esnext/index.esnext.cjs.js'),

    getES5('es', ['es5/index.es5.esm.js', 'es5/index.es5.mjs']),
    getES5('cjs', 'es5/index.es5.cjs.js'),
    getES5Umd('umd', 'es5/index.es5.umd.js', 'tezosPaymentsCommon'),
  ];
