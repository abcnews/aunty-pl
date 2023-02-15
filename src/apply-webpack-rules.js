const ABC_PACKAGE_PATTERN = /(node_modules\/@abcaustralia\/*)/;

module.exports.applyWebpackRules = config => {
  const isProd = config.mode === 'production';
  const { rules } = config.module;

  // Find existing styles rule
  const stylesRule = rules.find(rule => rule.__hint__ === 'styles');
  const stylesRuleIndex = rules.indexOf(stylesRule);

  // Exclude @abcaustralia/* packages from existing styles rule.
  stylesRule.exclude = ABC_PACKAGE_PATTERN;

  // Define PL styles rule (only applied to @abcaustralia/* packages)
  const plStylesRule = {
    __hint__: 'styles:pl',
    test: /\.css$/,
    include: ABC_PACKAGE_PATTERN,
    use: [
      // [Loader #3] Existing styles rule's "style-loader" or MiniCssExtractPlugin.loader
      stylesRule.use[0],
      // [Loader #2] Existing styles rule's "css-loader" with PL options (CSS modules)
      {
        loader: stylesRule.use[1].loader,
        options: {
          importLoaders: 1,
          modules: {
            exportLocalsConvention: 'camelCase',
            localIdentName: `${isProd ? '' : '[name]__[local]--'}[contenthash:base64:5]`
          },
          url: false
        }
      },
      // [Loader #1] PL "postcss-loader"
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            config: require.resolve('@abcaustralia/postcss-config')
          }
        }
      }
    ]
  };

  // Add PL styles rule
  rules.splice(stylesRuleIndex, 0, plStylesRule);
};
