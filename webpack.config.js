const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === 'dev';
const isProd = ENV === 'build';

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

function setDevTool() {
  if (isDev) {
    return 'source-map';
  } else {
    return '';
  }
}

function setDMode() {
  if (isProd) {
    return 'production';
  } else {
    return 'development';
  }
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  };

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }];

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
};

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      },
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {config: { path: './postcss.config.components' } }
    }
  ];

  if (extra) {
    loaders.push(extra)
  }

  return loaders
};

const optimization = (/* isProd */) => {
  // if (isProd) {
  //   const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  //
  //   res.minimize = true;
  //   res.minimizer = [
  //     new UglifyJsPlugin({
  //       parallel: require('os').cpus().length,
  //
  //       uglifyOptions: {
  //         ie8: false,
  //
  //         output: {
  //           // ecma: 8,
  //           beautify: false,
  //           comments: false
  //         }
  //       }
  //     })
  //   ]
  // }

  return {
    splitChunks: {
      chunks: 'all'
    }
  };
};

const config = {
  target: "web",
  entry: {
    app: ['babel-polyfill', './src/index.ts']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: filename('js')
  },
  mode: setDMode(),
  devtool: setDevTool(),
  optimization: optimization(isProd),
  resolve: {
    extensions: ['.js', '.json', '.ts'],
    // alias: {
    //   '@models': path.resolve(__dirname, 'src/models'),
    //   '@': path.resolve(__dirname, 'src'),
    // }
  },
  module: {
    rules: [{
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }]
      },
      {
        test: /\.js$/,
        // use: ['babel-loader', 'eslint-loader'],
        use: jsLoaders(),
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.scss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/img',
              name: '[name].[ext]'
            }
            },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug : true,
              mozjpeg: {
                progressive: true,
                quality: 75
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
                optimizationLevel: 1
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'fonts'
          }
        }]
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'url-loader',
        options: {
          outputPath: 'sounds',
          limit: 10000,
          name: '[name].[ext]',
          mimetype: 'audio/mpeg'
        }
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CopyWebpackPlugin([
      {from: './src/favicon.ico', to: './favicon.ico'},
      // {from: './src/assets/img', to: './assets/img/'},
    ]),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    overlay: true,
    stats: 'errors-only',
    clientLogLevel: 'none'
  }
};

module.exports = config;
