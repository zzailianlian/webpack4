/*
  使用dll技术，对某些库（第三方库：vue、react、jquery...）进行单独打包
  当你运行webpack时，默认使用的webpack.config.js配置文件
  使用dll时，得先通过 --config webpack.dll.js 来先执行下dll的配置文件
    --> 先通过运行webpack.dll.js配置文件来生成dll的静态资源和映射文件manifest.json
    --> 然后再走正常的webpack --config webpack.config.js 配置文件，走正常的webpack打包路径即可
*/

const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // 最终生成的[name] --> jquery
    // ['jquery'] --> 要打包的库是jquery
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' // 打包的库里面向外暴露出去的内容叫什么名字，如：jquery本身暴露出去的是$或者jQuery，我们这里改成[name]_[hash]的形式
  },
  module: {},
  plugins: [
    // 打包生活一个manifest.json的文件 --> 提供上面ouput的库的映射关系
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的export的名称，对应上之前output的库
      path: resolve(__dirname, 'dll/manifest.json') // 输出文件路径
    })
  ],
  mode: 'production'
}