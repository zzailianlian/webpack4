/**
 * 1、验证webpack的splitChunk的代码分隔功能
 * 2、验证webpack的预加载prefetch功能
 * 3、验证webpack注释 webpackChunkName:'xx' 和 webpackPrefetch:true 功能是否生效
 * 4、验证webpack的HMR功能
 */

import jquery from 'jquery'
console.log('我是b22333344123445566778899'); // export function count(x, y) {

//   return x - y;
// }

export const count = function count(x,   y) {
  return x - y;
};
export const multiple = function multiple(x,   y) {
  return x * y;
};
export const multiple2 = function multiple(x,   y) {
  return x * y;
};

export const consoleJquery = function (){
  console.log('$--jquery:b.js==:',jquery)
}