import jquery from 'jquery'
console.log('我是b'); // export function count(x, y) {

//   return x - y;
// }

export const count = function count(x,   y) {
  return x - y;
};
export const multiple = function multiple(x,   y) {
  return x * y;
};

export const consoleJquery = function (){
  console.log('$--jquery:b.js==:',jquery)
}