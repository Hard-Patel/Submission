// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };

const aliasPlugin = [
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: ['./src/'],
      alias: {
        api: '.src/api',
        interface: './src/interface',
        navigation: './src/navigation',
        theme: './src/theme',
        localization: './src/localization',
        screens: './src/screens',
        constants: './src/constants',
        components: './src/components',
        hooks: './src/hooks',
        assets: './src/assets',
        utils: './src/utils',
        global: './src/utils',
      },
    },
  ],
];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    development: {
      plugins: [...aliasPlugin, 'react-native-reanimated/plugin'],
    },
    production: {
      plugins: [
        ...aliasPlugin,
        // ['babel-plugin-jsx-remove-data-test-id', {attributes: ['testID']}],
        'transform-remove-console',
        'react-native-reanimated/plugin',
      ],
    },
  },
};
