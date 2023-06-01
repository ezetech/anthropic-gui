const {
  override,
  adjustStyleLoaders,
  addWebpackResolve,
  addWebpackModuleRule,
} = require('customize-cra');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = override(
  addWebpackModuleRule({
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            './src/assets/styles/colors.scss',
          ],
        },
      },
    ],
  }),
  adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
    // allow aliased import of mixins, variables, i.e. `@import 'core.scss'`
    if (processor && processor.loader.includes('sass-loader')) {
      processor.options.sassOptions = {
        includePaths: [path.resolve(__dirname, 'src/assets/styles')],
      };
    }
  }),
  addWebpackResolve({ plugins: [new TsconfigPathsPlugin()] }),
);
