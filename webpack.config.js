const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxWebpackPlugn = require('workbox-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// 定义node环境 => 其中一个目的是试用合适兼容范围的postcss兼容标准
process.env.NODE_ENV = 'development';

module.exports = {
  // 多入口会打多个chunk
  // entry: {index:'./src/js/index.js',b:'./src/js/b.js'},
  entry: './src/js/index.js',
  output: {
    // filename: 'js/[name].js',
    // 生产环境将文件名和contenthash关联上，可以有效利用缓存
    // 注意：如果是开发环境且开启了HMR功能，则这里只能用hash而不能用chunkhash或者contenthash，
    // 因为HMR的时候默认通过module.hot.accept来监听，如果每次编译文件名都变的话，就没办法准确监听到accept的文件了
    filename: 'js/[name]_[contenthash].js',
    path: resolve(__dirname, 'dist'),
    // publicPath: './',
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
                    // eslint-disable-next-line no-new-require,new-cap
                    (new require('postcss-preset-env'))(),
                  ],
                },
              },
            ],
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
                    // eslint-disable-next-line no-new-require,new-cap
                    new require('postcss-preset-env')(),
                  ],
                },
              },
              'less-loader',
            ],
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
                outputPath: 'img',
              },
            },
          },
          // {
          //   exclude: /\.(js|css|less|html|gif|png|jpe?g)/,
          //   // exclude: /\.(js|css|less|html|gif|png|jpe?g)/,
          //   use: {
          //     loader: 'file-loader',
          //     options: {
          //       outputPath: 'media',
          //     },
          //   },
          // },
          {
            test: /\.(gif|png|jpe?g)/,
            use: {
              loader: 'file-loader',
              options: {
                outputPath: 'img',
              },
            },
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
          },

          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              'thread-loader',
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                  presets: [
                    ['@babel/preset-env',
                      {
                        // 按需加载babel的polyfill
                        useBuiltIns: 'usage',
                        corejs: {
                          version: 3,
                        },
                        // 需要兼容的js平台
                        targets: {
                          chrome: '60',
                          firefox: '60',
                          ie: '9',
                          safari: '10',
                          edge: '17',
                        },
                      }],
                  ],
                },
              },
            ],
          },
        ],
      },

    ],
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
      },
    }),
    // 提取css样式文件到指定输出目录的单独css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash].css',
    }),
    // 压缩css样式文件
    new OptimizeCssAssetsWebpackPlugin(),
    // 生成workserver.js文件，帮助用户在离线时可以拉取workserver.js中的数据
    new WorkboxWebpackPlugn.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    // 将dll的静态资源通过manifest.json文件做映射
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json'),
    }),
    // 将静态资源自动导入到html文件中，这里主要用于dll资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js'),
    }),
  ],
  // mode: 'production',
  mode: 'development',
  externals: {
    // 将dayjs externals掉，这个时候webpack
    // import的时候如果看到是dayjs，则不会打包进入，这时候需要我们手动将dayjs的cdn引入到html中。
    // 注意：externals之后，就算在项目中是明确写了 import dayjs from 'dayjs'，也依然不会打包
    // key:value key是给我们自己看的，知道要external的是什么包，value是包export的值，例如：module.exports = jQuery
    dayjs: 'dayjs',
  },
  devtool: 'source-map',
  // 默认使用webpackd的代码分割方案，如果多个组件引入组件库，超出一定大小，会默认抽离出单独的chunk包
  optimization: {
    splitChunks: {
      // 一般都使用默认配置，只需要配置 chunks:'all'
      chunks: 'all',
      /* 其实我们配置了chunks:'all'就相当于配置了以下的所有属性 */
      // // 具体的默认配置都是什么呢？我们下面来写一下
      // minSize: 30 * 1024, // 分割的chunk最小为30kb
      // maxSize: 0, // 意思不是chunk的最大包限制是0，而是 没有限制！
      // minChunks: 1, // 要提取的chunk被引用的数量，只有达成条件才会被打包到chunk中
      // // 按需加载时并行加载的文件最大数量；这个跟浏览器的并行加载数量是没关系的；
      // // 如果这里设置的太高，超过浏览器的并行加载数量，依然会遵照浏览器的限制来。
      // // 相当于是取Math.min(maxAsyncRequests,浏览器并行限制)
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3, // 入口js文件最大并行请求数量
      // automaticNameDelimiter: '~', // 打包的chunk的名称中间的连接符，如：venders~hash.js
      // name: true, // 允许使用命名规则,如果是false，则上面的自定义的automaticNameDelimiter不生效
      // cacheGroups: {
      //   vendors: {
      //     // 路径中包含node_modules的被匹配，
      //     // [\\/]是为了兼容有的系统是 /node_modules/，
      //     // 有的系统是\node_modules\
      //     // 所以是 [\\/], \ 或 \/
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10, // 优先级
      //   },
      //   default: {
      //     minChunks: 2, // 最小被引入两次才会打包到chunk中
      //     priority: -20, // 优先级比node_module包的优先级低，因为三方包都最好先被打包，之后的项目源代码才被打包
      //     reuseExistingChunk: true, // 如果引入的包之前被打包过，就会使用之前的包，而不会重新打到chunk包中
      //   },
      // },
    },
    // 将模块的依赖关系作为单独的文件打包成runtimeChunk，这样依赖关系就会从直接依赖变成间接依赖，
    // 所有的依赖关系都走runtimeChunk来实现，这样做有什么好处吗？还记得之前的文件缓存中我们用到了
    // contenthash吗，如： a 中引入了b，b文件变了，b的文件名contenthash也变了，如果a直接引入了b，
    // 那a引入的b的文件名肯定也会变化，这就导致了a模块命名只更改了b模块引入处的名字，但是却重新编译了
    // 整个a文件，这就得不偿失了。所以就引入了runtimeChunk这样的包，来做依赖包之间的映射，只要key-value的map
    // 关系不变，那么无论b如何变化，都不会影响到a文件
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    // 开启gzip压缩
    compress: true,
    // open: true,
    hot: true,
    port: 5000,
    // quiet: true,
    // watchContentBase: true,
    // clientLogLevel: 'none'
  },
};
