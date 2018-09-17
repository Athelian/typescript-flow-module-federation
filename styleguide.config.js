const path = require('path');

module.exports = {
  styleguideComponents: {
    Wrapper: path.join(__dirname, '.styleguide/Wrapper'),
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?importLoaders=1',
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loader: 'file-loader',
          query: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
  },
  components: 'src/components/*(Cards|Dialog|Form|)/[A-Z]*/index.js',
  ignore: [
    '**/__tests__/*',
    '**/Styles/*',
    '**/style.js',
    '**/context.js',
    '**/enums.js',
    '**/messages.js',
    '**/*.stories.*',
  ],
};
