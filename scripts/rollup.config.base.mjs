import path from 'path';

import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typeScript from 'rollup-plugin-typescript2';

export const isWatchMode = !!process.env.ROLLUP_WATCH;
export const sourceDirectory = 'src';
export const outputDirectory = 'dist';
export const entryPointFilePath = path.join(sourceDirectory, 'index.ts');

export const externalPackageNames = [
  /@babel\/runtime/
];

export const defaultESBabelTargets = {
  node: '16.0.0',
  browsers: [
    '>0.35%',
    'not dead',
    'not op_mini all',
    'not ie <= 11'
  ]
};

export const watchPaths = [
  `${sourceDirectory}/**`,
  /tsconfig/
];

export const getBaseOutputOptions = ({ fileName, format }) => ({
  file: path.join(outputDirectory, fileName),
  format,
  sourcemap: true
});

export const getBaseTypeScriptPluginOptions = declarationEnabled => ({
  tsconfigOverride: {
    compilerOptions: {
      declaration: declarationEnabled,
      composite: declarationEnabled,
      tsBuildInfoFile: null
    }
  },
  useTsconfigDeclarationDir: declarationEnabled
});

export const getBaseBabelOptions = babelHelpers => ({
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

export const getResolvePlugins = format => format === 'umd'
  ? [
    json(),
    commonjs({
      extensions: ['.js'],
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
      preferBuiltins: false,
      browser: true
    }),
  ]
  : [
    nodeResolve({ resolveOnly: ['*'] }),
  ];

export const getDefaultES = (format, outputFileNameOrNames, declarationEnabled = false, watchEnabled = false) => ({
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

export const getDefaultESUmd = (format, outputFileName, globalName, globals = undefined) => ({
  input: entryPointFilePath,
  output: [
    {
      ...getBaseOutputOptions({ fileName: outputFileName, format }),
      name: globalName,
      globals
    },
  ],
  external: globals && Object.keys(globals),
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(false)),
    babel(getBaseBabelOptions('bundled')),
  ]
});

export const getESNext = (format, outputFileNameOrNames, declarationEnabled = false) => ({
  input: entryPointFilePath,
  output: (Array.isArray(outputFileNameOrNames) ? outputFileNameOrNames : [outputFileNameOrNames])
    .map(fileName => getBaseOutputOptions({ fileName, format })),
  external: externalPackageNames,
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(declarationEnabled)),
  ]
});

export const getES5 = (format, outputFileNameOrNames, declarationEnabled = false) => ({
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

export const getES5Umd = (format, outputFileName, globalName, globals = undefined) => ({
  input: entryPointFilePath,
  output: [
    {
      ...getBaseOutputOptions({ fileName: outputFileName, format }),
      name: globalName,
      globals
    }
  ],
  external: globals && Object.keys(globals),
  plugins: [
    ...getResolvePlugins(format),
    typeScript(getBaseTypeScriptPluginOptions(false)),
    babel({
      ...getBaseBabelOptions('bundled'),
      presets: ['@babel/preset-env']
    }),
  ]
});
