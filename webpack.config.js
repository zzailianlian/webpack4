
const webpack = require('webpack')
const { resolve, dirname } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WorkboxWebpackPlugn = require('workbox-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin")

// 定义node环境 => 其中一个目的是试用合适兼容范围的postcss兼容标准
process.env.NODE_ENV = 'development'

module.exports = {
  // 多入口会打多个chunk
  // entry: {index:'./src/js/index.js',b:'./src/js/b.js'},
  entry: './src/js/index.js',
  output: {
    // 将文件名和contenthash关联上，可以有效利用缓存
    filename: 'js/[name].js',
    // filename: 'js/[name]_[contenthash].js',
    path: resolve(__dirname, 'dist'),
    // publicPath: '/'
  },
  module: {
    rules: [
      // eslint，可以跟package.json中配置的eslingConfig相互作用，可以依赖业界比较权威的airbnb的标准来做代码检查
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/,
      //   options: {
      //     // 检查到代码语法错误之后自动修复
      //     fix: true
      //   }
      // },
      // oneOf：要求每个文件都只匹配一个规则，避免了每个文件都有走test/include/exclude的校验过程，加快打包速度
      {
        oneOf: [
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
              // 将js中的样式css代码已style标签的形式内联到html中，本身和miniCssExtractPlugin的作用冲突，二者只可取其一
              // 建议开发环境使用style-loader,一方面打包不用抽离，打包更快，第二方面是用style-loader的话可以让样式文件使用HMR功能
              // 'style-loader',
              // miniCssExtractPlugin将css文件抽离成单独的css文件
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                // css的兼容，需要用到postcss，可以与package.json的browerslist相互配合使用
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    // 预设一个兼容标准，更多配置详情依据package.json的browerslist，
                    // browerslist设置了开发环境和生产环境的兼容标准，这个根据process.env.NODE_ENV来判断
                    new require('postcss-preset-env')()
                  ]
                }
              }
            ]
          },
          {
            test: /\.less$/,
            exclude: /node_modules/,
            use: [
              // 'style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    new require('postcss-preset-env')()
                  ]
                }
              },
              'less-loader'
            ]
          },
          {
            test: /\.(png|gif|jpe?g)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 8 * 1024,
                name: '[hash:10].[ext]',
                // 针对HTML中的图片资源已commonJs的模块输出导致没办法用url-loader来处理，所以统一都用commonJs模块化来处理图片资源
                esModule: false,
                outputPath: 'img'
              }
            }
          },
          {
            exclude: /\.(js|css|less|html|gif|png|jpe?g)/,
            use: {
              loader: 'file-loader',
              options: {
                outputPath: 'media'
              }
            }
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          },

          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              cacheDirectory: true,
              presets: [
                ['@babel/preset-env',
                  {
                    // 按需加载babel的polyfill
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3
                    },
                    // 需要兼容的js平台
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }]
              ]
            }
          }
        ]
      },

    ]
  },
  plugins: [
    // 输出到dist前清空dist目录
    new CleanWebpackPlugin(),
    // 指定HTML问价模板，自动引入相应的script和link、style标签
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        // 干掉html中的注释
        removeComments: true,
        // 干掉html的空格、换行
        collapseWhitespace: true,
      }
    }),
    // 提取css样式文件到指定输出目录的单独css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash].css'
    }),
    // 压缩css样式文件
    new OptimizeCssAssetsWebpackPlugin(),
    // 生成workserver.js文件，帮助用户在离线时可以拉取workserver.js中的数据
    new WorkboxWebpackPlugn.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    // 将dll的静态资源通过manifest.json文件做映射
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将静态资源自动导入到html文件中，这里主要用于dll资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js'),
    })
  ],
  // mode: 'production',
  mode: 'development',
  externals: {
    // 将dayjsexternals掉，这个时候webpack 
    // import的时候如果看到是dayjs，则不会打包进入，这时候需要我们手动将dayjs的cdn引入到html中。
    // 注意：externals之后，就算在项目中是明确写了 import dayjs from 'dayjs'，也依然不会打包
    // key:value key是给我们自己看的，知道要external的是什么包，value是包export的值，例如：module.exports = jQuery
    'dayjs': 'dayjs',
  },
  devtool: 'source-map',
  // 默认使用webpackd的代码分割方案，如果多个组件引入组件库，超出一定大小，会默认抽离出单独的chunk包
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    // 开启gzip压缩
    compress: true,
    // open: true,
    // hot: true,
    port: 5000,
    quiet: true,
    // watchContentBase: true,
    // clientLogLevel: 'none'
  }
}